import os, re

with open('catalog-bundle.js', 'r', encoding='utf-8') as f:
    bundle = f.read()

# Pattern matching each module
chunks = re.split(r'// --------------------------------------------------------------------------\s*\n\s*// Chart: (template/[a-zA-Z0-9_\-]+/[a-zA-Z0-9_\-]+)', bundle)

print(f'Found {len(chunks)} chunks, modules count: {len(chunks)//2}')

count = 0
for i in range(1, len(chunks), 2):
    target_path = chunks[i].strip()
    target_body = chunks[i+1]
    
    # Extract the id
    id_match = re.search(r'global\.KitCharts\[\"([a-zA-Z0-9_\-]+)\"\]\s*=\s*\(function\(\)\s*\{', target_body)
    if not id_match:
        id_match = re.search(r'global\.KitCharts\[\'([a-zA-Z0-9_\-]+)\'\]\s*=\s*\(function\(\)\s*\{', target_body)
    
    if not id_match:
        print('Skipping (no id match):', target_path)
        continue
        
    tpl_id = id_match.group(1)
    
    # Find start after var KitChartsTheme = ThemeModule;
    theme_pos = target_body.find('var KitChartsTheme = ThemeModule;')
    if theme_pos == -1:
        print('No theme pos for', tpl_id)
        continue
    start_pos = theme_pos + len('var KitChartsTheme = ThemeModule;')
    
    # Find last `})();` or `})()`
    end_pos = target_body.rfind('})();')
    if end_pos == -1:
        end_pos = target_body.rfind('})()')
    
    if end_pos == -1 or end_pos <= start_pos:
        print('No end pos for', tpl_id)
        continue
        
    inner_code = target_body[start_pos:end_pos].strip()
    
    # Reconstruct standard UMD template
    template_code = f"""/**
 * @file {target_path}/template.js
 * @description Standardized Universal {tpl_id} Template for kit-charts.
 * Compatible with browsers (file://, http://), Node.js, and bundlers.
 */

(function(global, factory) {{
  if (typeof exports === 'object' && typeof module !== 'undefined') {{
    module.exports = factory(require('../../../themes/theme-tokens.js'));
  }} else if (typeof define === 'function' && define.amd) {{
    define(['../../../themes/theme-tokens.js'], factory);
  }} else {{
    global = typeof globalThis !== 'undefined' ? globalThis : global || self;
    var tokens = global.KitChartsTheme || (global.KitCharts && global.KitCharts.Theme) || {{}};
    var exp = factory(tokens);
    global.KitCharts = global.KitCharts || {{}};
    global.KitCharts['{tpl_id}'] = exp;
    global.createChart = exp.createChart;
    global.DEFAULT_DATA = exp.DEFAULT_DATA;
  }}
}})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof self !== 'undefined' ? self : this, function(KitChartsTheme) {{
{inner_code}
}});
"""
    dest_file = os.path.join(target_path, 'template.js')
    os.makedirs(os.path.dirname(dest_file), exist_ok=True)
    with open(dest_file, 'w', encoding='utf-8') as out:
        out.write(template_code)
    count += 1

print(f'Successfully restored {count} templates from catalog-bundle.js!')
