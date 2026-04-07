# Contributing to VOLTEX

Thank you for considering contributing to VOLTEX! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, Node version, browser)

### Suggesting Features

Feature requests are welcome! Please create an issue with:
- Clear description of the feature
- Use case and benefits
- Possible implementation approach
- Mockups or examples (if applicable)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/Innovates-yash/Laptop-Website.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments where necessary
   - Update documentation if needed

4. **Test your changes**
   ```bash
   npm run dev
   npm run build
   npm run lint
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Adding tests
   - `chore:` - Maintenance tasks

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Describe your changes
   - Submit the PR

## Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Add JSDoc comments for complex components

### File Naming
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Styles: `kebab-case.css`

### Code Formatting
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use trailing commas in objects/arrays

## Development Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup database**
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open Prisma Studio** (optional)
   ```bash
   npx prisma studio
   ```

## Project Structure

- `/app` - Next.js pages and API routes
- `/components` - React components
- `/lib` - Utility functions and configurations
- `/prisma` - Database schema and migrations
- `/store` - State management (Zustand)
- `/types` - TypeScript type definitions

## Testing

Before submitting a PR, ensure:
- [ ] Code builds without errors (`npm run build`)
- [ ] No linting errors (`npm run lint`)
- [ ] All features work as expected
- [ ] No console errors in browser
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] 3D animations work smoothly
- [ ] Database operations work correctly

## Areas for Contribution

### High Priority
- Complete admin panel (`/admin/dashboard`)
- Product management interface
- Advanced filtering and search
- Email notifications
- Unit tests

### Medium Priority
- Wishlist functionality
- Product reviews and ratings
- Advanced analytics
- Performance optimizations
- Accessibility improvements

### Low Priority
- Dark mode toggle
- Internationalization (i18n)
- PWA features
- Social media integration

## Questions?

If you have questions, feel free to:
- Open an issue
- Start a discussion
- Contact the maintainer

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow the project's coding standards

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to VOLTEX! 🚀
