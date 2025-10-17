# Safari Breakfasts UAE - Setup Instructions

## 🚀 Quick Start

1. **Download/Extract** all project files to a folder
2. **Open** `index.html` in your web browser
3. **Navigate** through the website using the main menu

## 📁 File Structure

```
safari-breakfasts-uae/
├── index.html              # 🏠 Homepage
├── about.html              # ℹ️ About Us
├── parks.html              # 🦁 Parks & Breakfasts
├── route.html              # 🗺️ Route Builder
├── vip.html                # 👑 VIP Offers
├── blog.html               # 📝 Blog
├── blog-single.html        # 📄 Single Blog Post
├── contact.html            # 📞 Contact Us
├── css/
│   ├── style.css           # 🎨 Main Styles
│   └── responsive.css      # 📱 Mobile Styles
├── js/
│   ├── main.js             # ⚡ Core JavaScript
│   ├── parks.js            # 🦁 Parks Features
│   ├── route-builder.js    # 🗺️ Route Builder
│   ├── blog.js             # 📝 Blog Features
│   └── contact.js          # 📞 Contact Form
├── images/                 # 🖼️ Image Assets
└── README.md               # 📖 Documentation
```

## 🌐 Local Development

### Option 1: Direct File Opening
- Simply double-click `index.html` to open in your browser
- Works for basic testing and development

### Option 2: Local Server (Recommended)
For better performance and testing:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit: `http://localhost:8000`

**Using Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server
```
Then visit: `http://localhost:8080`

**Using PHP:**
```bash
php -S localhost:8000
```
Then visit: `http://localhost:8000`

## 🔧 Customization Guide

### 1. Update Content
- **Text**: Edit HTML files directly
- **Images**: Replace files in `images/` folder
- **Colors**: Modify CSS variables in `css/style.css`

### 2. Add New Pages
1. Create new HTML file
2. Copy structure from existing pages
3. Update navigation in all pages
4. Add specific styles if needed

### 3. Modify Styling
- **Main styles**: `css/style.css`
- **Mobile styles**: `css/responsive.css`
- **Colors**: Update CSS variables at the top of `style.css`

### 4. Add JavaScript Features
- **Core features**: `js/main.js`
- **Page-specific**: Create new `.js` files
- **Include scripts**: Add `<script>` tags to HTML

## 📱 Testing

### Desktop Testing
- Test in Chrome, Firefox, Safari, Edge
- Check different screen sizes (1200px, 992px, 768px, 480px)
- Verify all interactive elements work

### Mobile Testing
- Use browser dev tools (F12 → Device Mode)
- Test on actual mobile devices
- Check touch interactions and scrolling

### Performance Testing
- Use browser dev tools → Performance tab
- Check Core Web Vitals
- Optimize images if needed

## 🚀 Deployment

### Static Hosting (Recommended)
- **Netlify**: Drag and drop the folder
- **Vercel**: Connect GitHub repository
- **GitHub Pages**: Push to GitHub repository
- **AWS S3**: Upload files to S3 bucket

### Web Server
- Upload all files to web server
- Ensure proper MIME types for `.webp` images
- Configure server for single-page routing if needed

## 🔍 Troubleshooting

### Common Issues

**Images not loading:**
- Check file paths in HTML
- Ensure images are in correct folders
- Verify image file extensions

**Styles not applying:**
- Check CSS file paths
- Clear browser cache
- Verify CSS syntax

**JavaScript not working:**
- Check browser console for errors
- Verify JavaScript file paths
- Ensure proper HTML structure

**Mobile layout issues:**
- Check responsive CSS file is loaded
- Verify viewport meta tag
- Test on different screen sizes

### Browser Compatibility
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **IE**: Not supported (uses modern CSS/JS)

## 📞 Support

For technical support or questions:
- **Email**: dev@safaribreakfasts.ae
- **Phone**: +971 50 073 0213

## 🎯 Next Steps

1. **Content**: Replace placeholder content with real information
2. **Images**: Add high-quality photos of parks and experiences
3. **Backend**: Integrate with booking system and database
4. **Analytics**: Add Google Analytics or similar
5. **SEO**: Optimize for search engines
6. **Testing**: Comprehensive testing across devices and browsers

---

**Ready to launch your Safari Breakfasts UAE website!** 🚀🦁
