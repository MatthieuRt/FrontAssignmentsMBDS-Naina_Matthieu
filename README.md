# FrontAssignmentsMBDS-Naina_Matthieu 
Projet réalisé en binôme : `3 - ANDRIAMPARANY Naina` et `47 - RATSARATOETRA Matthieu Nomen'Ny Avo`    
Lien du site hebergé sur render.com : https://frontassignmentsmbds-naina-matthieu.onrender.com/login  

# Présentation du projet :
Le projet que nous avons fait est une amélioration du projet déjà commencé par le professeur Michel Buffa.  
Dans ce projet sur la gestion des Assignments, l'utilisateur peut avoir un des trois rôles existants :  
- Eleve : peut voir la liste des matières qu'il suit, voir la liste des assignments par matière ainsi que les détails et rendre  
- Prof : peut voir la liste des matières auquel il est attribué, voir la liste des assignments RENDUS par matière et noter  
- Admin : peut voir la liste de tous les assignments ainsi que les détails, et peut modifier les assignments.  

Les identifiants déjà existants pour faire des tests  :  
- PROF = mail : `axelinfiny19@gmail.com` |  mot de passe : `password`  

- ADMIN = mail : `pvp09125@vogco.com` | mot de passe : `password`  

- ETUDIANT = mail : `jjgold@mail.com` | mot de passe : `password`  

# Nos contributions : 
## Front : 
- Amélioration du design global du site  
	-> Intégration d'un template HTML
  
- Login avec gestion de Tokens via JWT
  
- Inscription avec envoi de Mail de bienvenue
  
- Affichage de la liste des matières d'un etudiant avec pagination
  
- Affichage des détails d'une matière avec la liste des assignments assigné à chaque étudiant pour cette matière

- Affichage des details d'un assignment en selectionnant un assignments
  
- Rendu d'un assignment avec un système de drag and drop
  
- Ajout d'assignments avec un formulaire de type Stepper
  
- Création de matière avec upload de son image et celle du prof.
  
- Liste des assignments non notés par matière
  
- Notation d'un ou plusieurs assignments avec système de drag and drop
  
- Amelioration de l'affichage des assignments(filtre,pagination,design)
  
- Modification d'un assignments pour le rôle admin (modal de modification et fonction )
  

## Back :  
- API pour la connexion avec JWT

- API pour l'inscription d'un utilisateur avec envoi de mail  

- Amelioration des modèles de données (collection assignment, matière,matiere-etudiant,utilisateur) 

- API pour récupérer la liste des matières paginées d'un etudiant  

- API pour récupérer la liste des assignments par matières  

- API pour récupérer la liste des assignments par matière et par etudiant  

- API pour récupérer la liste des assignments par matière et par prof  

- Amelioration de l'api update des assignments  

- Amélioration de l'api d'ajout d'assignments  

- API pour rendre un ou plusieurs assignments  

- API pour noter un ou plusieurs assignments  


# Comment le faire tourner en local  
## Back : NodeJS  
1) Cloner le repository GitHub : https://github.com/NainaMatthieu/BackAssignmentsMDBS_Naina_Matthieu.git
   
2) Installer les dépendances nécessaires :  
   ```
   npm install
   ```
3) Démarrer l'application :  
   ```
   node server.js
   ```

## Front : Angular
1) Cloner le repository GitHub : https://github.com/MatthieuRt/FrontAssignmentsMBDS-Naina_Matthieu.git

2) Installer les dépendances nécessaires :  
   ```
   npm install
   ```
   
3) Démarrer l'application :
   ```
   ng serve
   ```
4) Accéder à l'application via le lien : http://localhost:4200
