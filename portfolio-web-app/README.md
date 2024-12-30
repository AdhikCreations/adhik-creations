# Portfolio Web App

## Overview

This is a responsive web application showcasing Adhik Creations' portfolio of event decorations, return gifts, and creative services. The application features:

- Responsive image and video galleries
- Custom video player with controls
- Mobile-friendly navigation
- Contact form integration
- Multiple portfolio collections
- Modal view for detailed media viewing

The site is built using vanilla JavaScript, HTML5, and CSS3, requiring no additional frameworks or dependencies. It's designed to be easily maintainable and extendable with new portfolio items.

Live Demo: [https://adhik-creations.github.io/portfolio-web-app](https://adhik-creations.github.io/portfolio-web-app)

## How to Add New Portfolio Items

To add new items to the portfolio page, you need to modify the `portfolioData` object in `assets/js/portfolio.js`. Each portfolio item consists of a collection of images and/or videos.

### Portfolio Data Structure

```javascript
{
    folder: "collection-name",    // Folder name for the collection
    title: "Collection Title",    // Display title for the collection
    media: [                      // Array of media items (images/videos)
        // Media items go here
    ]
}
```

### Adding Images

To add images to a collection:

1. Place your image files in the folder: `assets/images/portfolio/[collection-name]/`
2. Add image entries to the media array:

```javascript
{
    folder: "my-collection",
    title: "My New Collection",
    media: [
        {
            type: 'image',
            src: "assets/images/portfolio/my-collection/image1.jpg"
        },
        {
            type: 'image',
            src: "assets/images/portfolio/my-collection/image2.jpg"
        }
    ]
}
```

### Adding Videos

To add videos to a collection:

1. Place your video files in the folder: `assets/images/portfolio/[collection-name]/`
2. Create thumbnail images for your videos
3. Add video entries to the media array:

```javascript
{
    folder: "my-collection",
    title: "My New Collection",
    media: [
        {
            type: 'video',
            src: "assets/images/portfolio/my-collection/video1.mp4",
            thumbnail: "assets/images/portfolio/my-collection/video1-thumb.jpg"
        }
    ]
}
```

### Complete Example

Here's a complete example of adding a new collection with both images and videos:

```javascript
{
    folder: "mixed-collection",
    title: "Mixed Media Collection",
    media: [
        {
            type: 'image',
            src: "assets/images/portfolio/mixed-collection/image1.jpg"
        },
        {
            type: 'video',
            src: "assets/images/portfolio/mixed-collection/video1.mp4",
            thumbnail: "assets/images/portfolio/mixed-collection/video1-thumb.jpg"
        },
        {
            type: 'image',
            src: "assets/images/portfolio/mixed-collection/image2.jpg"
        }
    ]
}
```

### File Organization

- All portfolio media should be placed in: `assets/images/portfolio/`
- Create a new subdirectory for each collection
- Use consistent naming for your files (e.g., image1.jpg, image2.jpg)
- Video thumbnails should have a "-thumb" suffix

### Supported File Formats

- Images: JPG, PNG
- Videos: MP4 (H.264 encoded recommended)

### Best Practices

1. Optimize your images for web (compress them)
2. Keep video files under 10MB for better loading
3. Use descriptive folder names
4. Create thumbnail images that are representative of the video content
5. Test the carousel after adding new items

## Git and GitHub Workflow

### Initial Setup (First time only)

1. Configure Git with your credentials:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

2. Generate SSH key (if not already done):
```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

3. Add SSH key to GitHub:
   - Copy the contents of `~/.ssh/id_ed25519.pub`
   - Go to GitHub → Settings → SSH Keys → New SSH Key
   - Paste your key and save

### Regular Workflow

1. Before making changes, pull the latest updates:
```bash
git pull origin main
```

2. Create a new branch for your changes:
```bash
git checkout -b feature/add-new-portfolio-items
```

3. After adding new portfolio items, stage your changes:
```bash
# Stage specific files
git add assets/images/portfolio/new-collection/*
git add assets/js/portfolio.js

# Or stage all changes
git add .
```

4. Commit your changes with a descriptive message:
```bash
git commit -m "Add new portfolio collection: [collection-name]"
```

5. Push your changes to GitHub:
```bash
git push origin feature/add-new-portfolio-items
```

6. Create a Pull Request:
   - Go to your repository on GitHub
   - Click "Compare & pull request"
   - Review your changes
   - Add a description of your changes
   - Click "Create pull request"

### Common Git Commands

```bash
# Check status of your changes
git status

# View difference between staged and unstaged changes
git diff

# View commit history
git log

# Discard changes in a file
git checkout -- filename

# Switch to existing branch
git checkout branch-name

# List all branches
git branch

# Delete a branch (after merging)
git branch -d branch-name
```

### Best Practices for Commits

1. Keep commits focused and atomic
2. Write clear commit messages
3. Commit frequently
4. Always pull before starting new work
5. Test changes before committing
6. Use meaningful branch names

### Resolving Conflicts

If you encounter merge conflicts:

1. Pull the latest changes:
```bash
git pull origin main
```

2. Resolve conflicts in the affected files
   - Look for `<<<<<`, `=====`, and `>>>>>` markers
   - Edit files to resolve conflicts
   - Remove conflict markers

3. Stage and commit resolved files:
```bash
git add .
git commit -m "Resolve merge conflicts"
```

4. Push your changes:
```bash
git push origin your-branch-name
```

### Emergency Commands

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Completely undo last commit (discard changes)
git reset --hard HEAD~1

# Stash changes temporarily
git stash

# Apply stashed changes
git stash pop
```

Remember to always create a backup of your work before using any destructive Git commands.
