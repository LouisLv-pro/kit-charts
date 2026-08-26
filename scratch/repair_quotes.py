import glob, re

for fpath in glob.glob('template/**/template.js', recursive=True):
    with open(fpath, 'r', encoding='utf-8') as f:
        code = f.read()
    
    fixed = code
    fixed = fixed.replace('"undefined\'', "'undefined'")
    fixed = fixed.replace("'undefined\"", "'undefined'")
    fixed = fixed.replace('"#2B8CBE\'', "'#2B8CBE'")
    fixed = fixed.replace('"#999999\'', "'#999999'")
    fixed = fixed.replace('"#3182BD\'', "'#3182BD'")
    fixed = fixed.replace('"#2E7D32\'', "'#2E7D32'")
    fixed = fixed.replace('"\';', "'';")
    fixed = fixed.replace("['Groupe 1\", \\'Groupe 2\", 'Groupe 3']", "['Groupe 1', 'Groupe 2', 'Groupe 3']")
    fixed = fixed.replace("labels || ['Groupe 1\", \\'Groupe 2\", 'Groupe 3']", "labels || ['Groupe 1', 'Groupe 2', 'Groupe 3']")
    fixed = fixed.replace("'Erreur d'authentification'", '"Erreur d\'authentification"')
    fixed = fixed.replace("'Occurrences d'Incidents'", '"Occurrences d\'Incidents"')
    fixed = fixed.replace("'Nombre d'occurrences'", '"Nombre d\'occurrences"')
    fixed = fixed.replace("'Total d'Incidents'", '"Total d\'Incidents"')
    fixed = fixed.replace("'Chiffre d'Affaires (M€)'", '"Chiffre d\'Affaires (M€)"')
    fixed = fixed.replace("'Chiffre d'Affaires'", '"Chiffre d\'Affaires"')
    fixed = fixed.replace("'Chiffre d'Affaires Global (M€)'", '"Chiffre d\'Affaires Global (M€)"')
    fixed = fixed.replace("'Total Chiffre d'Affaires'", '"Total Chiffre d\'Affaires"')
    fixed = fixed.replace("'Temps d'Attente (min)'", '"Temps d\'Attente (min)"')
    fixed = fixed.replace("'Temps d'Attente vs Score de Satisfaction'", '"Temps d\'Attente vs Score de Satisfaction"')
    fixed = fixed.replace("'Budget R&D vs Chiffre d'Affaires (M€)'", '"Budget R&D vs Chiffre d\'Affaires (M€)"')
    fixed = fixed.replace("'Repère 'Aujourd'hui' (J8.0)'", '"Repère Aujourd\'hui (J8.0)"')
    fixed = fixed.replace("'Repère 'Aujourd'hui''", '"Repère Aujourd\'hui"')
    fixed = fixed.replace("'Aujourd'hui'", '"Aujourd\'hui"')
    fixed = fixed.replace("'Coûts d'Infrastructure'", '"Coûts d\'Infrastructure"')
    fixed = fixed.replace("'Gains d'Efficacité'", '"Gains d\'Efficacité"')
    fixed = fixed.replace("'Score d'Efficacité 2026'", '"Score d\'Efficacité 2026"')
    fixed = fixed.replace("'Score d\\'Efficacité 2026'", '"Score d\'Efficacité 2026"')
    fixed = fixed.replace("'Ligne 'Aujourd'hui''", '"Ligne Aujourd\'hui"')
    fixed = fixed.replace("'Ligne \\'Aujourd\\'hui\\''", '"Ligne Aujourd\'hui"')

    if fixed != code:
        with open(fpath, 'w', encoding='utf-8') as f:
            f.write(fixed)
        print('Repaired', fpath)

print('Done repairs.')
