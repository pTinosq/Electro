# Contributing to Electro

Thank you for your interest in contributing to Electro! This project is designed to be a great place for developers of all skill levels to get involved, whether you are just starting out or an experienced contributor.

## Getting Started

1. **Fork the Repository** – Click the 'Fork' button on the Electro repository to create your own copy.
2. **Clone Your Fork** – Clone the forked repository to your local machine:

   ```sh
   git clone https://github.com/your-username/Electro.git
   ```

3. **Set Upstream Remote** – Add the original Electro repository as an upstream remote:

   ```sh
   git remote add upstream https://github.com/ElectroOrg/Electro.git
   ```

4. **Create a Branch** – Work on your changes in a feature branch:

   ```sh
   git checkout -b feature/your-feature-name
   ```

## Branching Strategy

Electro follows a structured branching model to ensure stability across different versions:

- **`main`** – The production branch containing stable, tested releases.
- **`beta`** – The pre-release branch for features that have been sufficiently tested in `dev`.
- **`dev`** – The active development branch where all changes are initially merged. Once changes are tested and stable, they move to `beta`. When `beta` is confirmed to be issue-free, it gets merged into `main`.

### Where to Target Your PR

- All changes should be based on `dev`.
- Once tested and confirmed stable, changes from `dev` will be merged into `beta`.
- `main` only receives changes after they have been verified in `beta`.

## Submitting a Pull Request

1. **Ensure Your Code is Up-to-Date**

   ```sh
   git fetch upstream
   git checkout dev
   git merge upstream/dev
   ```

2. **Commit Your Changes**

   ```sh
   git commit -m "Add feature: description here"
   ```

3. **Push Your Changes**

   ```sh
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** – Navigate to the Electro repository, and open a pull request against `dev`.

## Code Guidelines

- Keep your code clean and well-documented.
- Follow the existing code style and structure.
- Ensure your changes do not break existing functionality.

## Feedback & Discussion

If you are unsure about anything, feel free to open a discussion or issue before making changes. We encourage collaboration and want to make contributing as smooth as possible!

Thank you for your interest in Electro! We look forward to your contributions. 🚀
