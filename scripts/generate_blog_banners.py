import os
from PIL import Image, ImageDraw, ImageFont

def create_banner(
    filename,
    title_category,
    main_title,
    subtitle,
    badge_left,
    badge_right,
    accent_primary=(79, 70, 229), # Indigo
    accent_light=(238, 242, 255),
    tag_bg=(243, 244, 246),
):
    w, h = 1200, 630
    # Day-mode background: Light soft slate
    img = Image.new('RGBA', (w, h), (248, 250, 252, 255))
    draw = ImageDraw.Draw(img)
    
    # Subtle ambient gradient
    for y in range(h):
        r = int(248 + (255 - 248) * (1 - y / h))
        g = int(250 + (255 - 250) * (1 - y / h))
        b = int(252 + (255 - 252) * (1 - y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    # Top vibrant accent stripe
    draw.rectangle([(0, 0), (w, 8)], fill=accent_primary + (255,))
    
    # Subtle dot matrix pattern
    dot_color = (226, 232, 240, 180)
    for x in range(35, w, 35):
        for y in range(35, h, 35):
            draw.ellipse([(x, y), (x+2, y+2)], fill=dot_color)

    font_path_bold = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
    font_path_reg = '/System/Library/Fonts/Supplemental/Arial.ttf'
    
    font_tag = ImageFont.truetype(font_path_bold, 17)
    font_title = ImageFont.truetype(font_path_bold, 40)
    font_sub = ImageFont.truetype(font_path_reg, 21)
    font_small = ImageFont.truetype(font_path_bold, 14)
    font_footer = ImageFont.truetype(font_path_reg, 14)
    font_card_header = ImageFont.truetype(font_path_bold, 22)
    font_card_body = ImageFont.truetype(font_path_reg, 18)

    # Main Card container
    card_x1, card_y1, card_x2, card_y2 = 60, 45, w - 60, h - 45
    
    # Dropshadow simulation
    for s in range(16, 0, -2):
        alpha = int(12 - s * 0.6)
        draw.rounded_rectangle(
            [(card_x1 - s, card_y1 - s), (card_x2 + s, card_y2 + s)],
            radius=26,
            fill=(203, 213, 225, alpha)
        )
        
    # Main White Card
    draw.rounded_rectangle(
        [(card_x1, card_y1), (card_x2, card_y2)],
        radius=24,
        fill=(255, 255, 255, 255),
        outline=(226, 232, 240, 255),
        width=2
    )

    # Top Pill Category Tag
    tag_text = title_category.upper()
    tag_bbox = draw.textbbox((0, 0), tag_text, font=font_tag)
    tag_w = tag_bbox[2] - tag_bbox[0] + 30
    draw.rounded_rectangle(
        [(100, 75), (100 + tag_w, 112)],
        radius=12,
        fill=accent_light + (255,),
        outline=accent_primary + (200,),
        width=1
    )
    draw.text((115, 83), tag_text, font=font_tag, fill=accent_primary + (255,))
    
    # Trust badge right
    draw.rounded_rectangle(
        [(w - 440, 75), (w - 100, 112)],
        radius=12,
        fill=(236, 253, 245, 255),
        outline=(167, 243, 208, 255),
        width=1
    )
    trust_text = "100% PRIVATE • CLIENT-SIDE WASM"
    draw.text((w - 410, 84), trust_text, font=font_small, fill=(5, 150, 105, 255))

    # Main Title
    draw.text((100, 135), main_title, font=font_title, fill=(15, 23, 42, 255))
    
    # Subtitle
    draw.text((100, 195), subtitle, font=font_sub, fill=(71, 85, 105, 255))

    # Two Interactive Graphic Cards (Day Mode)
    box_y1 = 255
    box_y2 = 490
    
    # Left Box
    draw.rounded_rectangle(
        [(100, box_y1), (510, box_y2)],
        radius=18,
        fill=(248, 250, 252, 255),
        outline=(226, 232, 240, 255),
        width=2
    )
    # Left Header Strip
    draw.rounded_rectangle(
        [(100, box_y1), (510, box_y1 + 45)],
        radius=16,
        fill=(241, 245, 249, 255)
    )
    draw.text((120, box_y1 + 12), badge_left[0], font=font_card_header, fill=(30, 41, 59, 255))
    
    # Left items
    for idx, item in enumerate(badge_left[1:]):
        item_y = box_y1 + 65 + idx * 42
        draw.rounded_rectangle([(120, item_y + 4), (134, item_y + 18)], radius=4, fill=(239, 68, 68, 255))
        draw.text((146, item_y), item, font=font_card_body, fill=(51, 65, 85, 255))

    # Center Transform Button Icon
    cx = 550
    cy = (box_y1 + box_y2) // 2
    draw.ellipse([(cx - 24, cy - 24), (cx + 24, cy + 24)], fill=accent_primary + (255,))
    draw.polygon([(cx - 7, cy - 10), (cx + 9, cy), (cx - 7, cy + 10)], fill=(255, 255, 255, 255))

    # Right Box
    draw.rounded_rectangle(
        [(590, box_y1), (w - 100, box_y2)],
        radius=18,
        fill=(240, 253, 244, 255),
        outline=(187, 247, 208, 255),
        width=2
    )
    # Right Header Strip
    draw.rounded_rectangle(
        [(590, box_y1), (w - 100, box_y1 + 45)],
        radius=16,
        fill=(220, 252, 231, 255)
    )
    draw.text((610, box_y1 + 12), badge_right[0], font=font_card_header, fill=(22, 101, 52, 255))

    # Right items
    for idx, item in enumerate(badge_right[1:]):
        item_y = box_y1 + 65 + idx * 42
        draw.rounded_rectangle([(610, item_y + 4), (624, item_y + 18)], radius=4, fill=(16, 185, 129, 255))
        draw.text((636, item_y), item, font=font_card_body, fill=(20, 83, 45, 255))

    # Inside-card bottom footer
    draw.line([(100, 525), (w - 100, 525)], fill=(241, 245, 249, 255), width=1)
    footer_text = "FileZenith Fast Browser Utilities • 100% Free • Official 2026-27 Standards"
    draw.text((100, 542), footer_text, font=font_footer, fill=(148, 163, 184, 255))
    
    sec_pill = "Daylight Mode Verified"
    s_bbox = draw.textbbox((0, 0), sec_pill, font=font_footer)
    draw.text((w - 100 - (s_bbox[2] - s_bbox[0]), 542), sec_pill, font=font_footer, fill=(99, 102, 241, 255))

    # Save lightweight WebP
    rgb_img = img.convert('RGB')
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    rgb_img.save(filename, 'WEBP', quality=90, method=6)
    print(f"Generated {filename} ({os.path.getsize(filename)//1024} KB)")

# 1. HEIC to JPG
create_banner(
    'public/blog/heic-to-jpg.webp',
    'Image Format Guide',
    'How to Convert iPhone HEIC to JPG Online Free',
    'Batch convert Apple .HEIC photos to universal JPG format with zero quality loss.',
    ['Apple iOS Original (.HEIC)', 'Rejected on SSC, UPSC, NTA forms', 'Cannot open on Windows 10/11', 'Non-standard container format'],
    ['Universal Standard (.JPG)', '100% Accepted on all portals', 'Instant browser batch processing', 'Retains original EXIF & vivid color'],
    accent_primary=(79, 70, 229),
    accent_light=(238, 242, 255)
)

# 2. JPG to PDF
create_banner(
    'public/blog/jpg-to-pdf.webp',
    'PDF Document Guide',
    'How to Convert Multiple JPG Images to One PDF',
    'Combine receipts, certificates, and photo scans into one clean, optimized PDF.',
    ['Scattered JPG/PNG Photos', 'Individual loose image files', 'Exceeds portal file upload limit', 'Disorganized page ordering'],
    ['Unified Clean PDF Document', 'Custom page order & auto-rotation', 'Compressed under 200KB / 500KB', 'Instant download with zero watermark'],
    accent_primary=(14, 165, 233),
    accent_light=(224, 242, 254)
)

# 3. SIP Calculator Guide
create_banner(
    'public/blog/sip-calculator.webp',
    'Finance & Wealth Guide',
    'SIP Calculator: Mutual Fund Compounding Guide',
    'Calculate monthly returns, Step-Up SIP growth, and reach your Rs 1 Crore wealth goal.',
    ['Traditional Fixed Deposits', '7% Return struggles with inflation', 'Fixed contributions without step-up', 'Slow wealth compounding rate'],
    ['Systematic Investment Plan', '12% - 15% Historic equity CAGR', 'Power of compounding over 10-20 yrs', 'Step-Up 10% annual top-up formula'],
    accent_primary=(16, 185, 129),
    accent_light=(236, 253, 245)
)

# 4. CGPA to Percentage Guide
create_banner(
    'public/blog/cgpa-calculator.webp',
    'Academic & Placements Guide',
    'CGPA to Percentage: Exact University Formulas',
    'Convert 10-point and 7-point CGPA scores for CBSE, VTU, Mumbai Univ & placements.',
    ['Confusing CGPA Formats', 'College uses 10.0 scale system', 'Placement forms require exact %', 'Standard multiplier errors (x10 vs x9.5)'],
    ['Verified University Formulas', 'CBSE Class 10: CGPA x 9.5', 'VTU: (CGPA - 0.75) x 10', 'Accepted for TCS, Infosys, UPSC & Govt'],
    accent_primary=(139, 92, 246),
    accent_light=(245, 243, 255)
)
