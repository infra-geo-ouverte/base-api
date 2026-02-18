# IGO - Base API

[GitLab](https://gitlab.forge.gouv.qc.ca/pig/igo2/base-api) • [Issues](https://gitlab.forge.gouv.qc.ca/pig/igo2/base-api/issues)

Ce projet contient les librairies de base et les intégrations de framework pour les projets API IGO. Il fournit un ensemble d'utilitaires et de patrons réutilisables pour la construction d'APIs robustes.

## Contenu

| Section                                      | Description                                 |
| -------------------------------------------- | ------------------------------------------- |
| [🚧 Requis](#-requis)                        | Dépendances requises                        |
| [🎓 Setup du projet](#-setup-du-projet)      | Comment setuper le projet initialement      |
| [📜 Commandes](#-commandes-npm)              | Commandes disponibles                       |
| [🔒 Architecture](#-architecture)            | Architecture du projet (Monorepo)           |
| [🚀 Commits & Releases](#-commits--releases) | Gestion des versions et des commits         |
| [🌎 Contribution](#-contribution)            | Explication du flow de développement        |
| [🧰 Dépannage](#-dépannage)                  | Liste des problèmes possibles avec solution |

## 🚧 Requis

- [Git]
- [Node.js] >= 20.0.0 qui inclus le [Node Package Manager][npm]
- IDE: VS Code avec extensions Eslint, Prettier

## 🎓 Setup du projet

Ce projet est un monorepo géré avec `npm` workspaces et `turbo`.

1. **Installation des dépendances** :

   ```bash
   npm install
   ```

2. **Build initial** :
   ```bash
   npm run build
   ```

## 📜 Commandes NPM

| Commande             | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| `npm run build`      | Compiler tous les packages via Turbo.                              |
| `npm run lint`       | Analyser les erreurs syntaxiques et les règles de styles.          |
| `npm run lint.fix`   | Corriger automatiquement les erreurs de lint.                      |
| `npm run format`     | Vérifier le formatage du code avec Prettier.                       |
| `npm run format.fix` | Appliquer le formatage Prettier.                                   |
| `npm run types`      | Analyser la syntaxe du code TypeScript sur l'ensemble du monorepo. |

## 🔒 Architecture

Le projet est organisé en packages :

- [**`@igo2/base-api`**](./packages/base-api/README.md) : Utilitaires de base (Base64, UUID, helpers, sanitization, templates).
- [**`@igo2/fastify`**](./packages/fastify/README.md) : Intégrations spécifiques à Fastify (Auth, Database, Logger, Swagger).

## 🚀 Commits & Releases

Le projet utilise **Semantic Release** pour automatiser la gestion des versions et les publications sur GitLab. Pour que cela fonctionne, nous suivons la convention **Conventional Commits**.

### 📜 Convention de Commit

Chaque message de commit doit respecter le format suivant :
`<type>(scope): <description>`

- **feat**: Une nouvelle fonctionnalité (déclenche une version `minor`).
- **fix**: Une correction de bug (déclenche une version `patch`).
- **chore/docs/style/refactor**: Changements qui n'impactent pas la version de production (ne déclenche pas de release).
- **BREAKING CHANGE**: Un changement majeur dans l'API (déclenche une version `major`). **Note :** Doit être mentionné dans le pied de page (footer) du commit.

### 🤖 Semantic Release

À chaque fusion (merge) dans la branche principale, un pipeline est déclenché pour :

1. Analyser les commits depuis la dernière release.
2. Déterminer le prochain numéro de version.
3. Créer un tag Git et une release.
4. Publier les packages sur le registre.

## 🌎 Contribution

1. Créer une branche pour votre fonctionnalité ou correction.
2. Effectuer les changements et s'assurer que le build et les tests passent.
3. Créer une Merge Request sur GitLab avec une description claire.

## 🧰 Dépannage

- **Problèmes de build Turbo** : Si vous rencontrez des erreurs de cache inattendues, vous pouvez supprimer le dossier `.turbo` à la racine ou dans les packages.
- **Node version** : Assurez-vous d'utiliser une version >= 20.0.0.

[git]: https://git-scm.com/
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/get-npm
