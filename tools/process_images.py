"""Optimise client photos into responsive WebP files for the site.

Usage: python3 tools/process_images.py <raw_drive_dir> <before_after_dir> <out_dir>
Raw files are the client's Google Drive photos (not committed). Output is
public/assets/img/<slug>-<width>.webp plus a JSON manifest of dimensions.
"""
import json, os, sys
from PIL import Image, ImageOps

RAW, BA, OUT = sys.argv[1:4]
os.makedirs(OUT, exist_ok=True)

# slug: (source file prefix in RAW, crop box as fractions or None, widths)
PHOTOS = {
    "lawn-mowing-wellington-point-owner": ("16gDn-", None, [640, 960, 1290]),
    "lawn-mowing-cleveland-canal-front": ("14283R", None, [480, 800, 1200]),
    "striped-lawn-mowing-wellington-point": ("13Uj6b", None, [480, 800, 1200]),
    "lawn-mowing-poolside-ormiston": ("1qEYkw", None, [480, 800, 1200]),
    "front-lawn-mowing-ormiston": ("15gjAu", None, [480, 960, 1600]),
    "waterfront-lawn-care-redlands": ("1HcDeT", None, [480, 960, 1600]),
    "lawn-mowing-thornlands-front-yard": ("1F3-V8", None, [480, 960, 1600]),
    "curved-lawn-edging-birkdale": ("1gK3gw", None, [480, 800, 1200]),
    "verge-mowing-capalaba": ("1rUj3e", None, [480, 800, 1200]),
    "front-yard-mowing-victoria-point": ("1smyST", None, [480, 960, 1600]),
    "large-lawn-mowing-redland-bay": ("1u_d9V", None, [480, 800, 1200]),
    "hedge-trimming-poolside-cleveland": ("19l3lY", None, [480, 960, 1600]),
    "hedge-trimming-driveway-wellington-point": ("1BLXXU", None, [480, 960, 1600]),
    "hedge-trimming-side-path-thornlands": ("1C8Obh", None, [480, 800, 1200]),
    "box-hedge-trimming-waterfront-redlands": ("1TDPPf", None, [480, 800, 1200]),
    "privacy-hedge-trimming-ormiston": ("1XtCWs", None, [480, 800, 1200]),
    "hedge-trimming-front-garden-birkdale": ("1ZvVk5", None, [480, 960, 1600]),
    "hedge-trimming-white-wall-cleveland": ("1o8kKz", None, [480, 960, 1600]),
    "shrub-shaping-garden-maintenance-capalaba": ("1odhMN", None, [480, 960, 1600]),
    "street-hedge-trimming-thorneside": ("173dP8", None, [480, 960]),
    "hedge-trimming-wellington-point-team": ("1Ji__C", None, [480, 960, 1290]),
    "hedge-and-lawn-care-victoria-point": ("1iGkAW", None, [480, 960, 1600]),
    "weed-spraying-redlands-garden-bed": ("1aHoqz", None, [480, 800, 1200]),
    "whipper-snipping-redlands-edges": ("158hw3", (0, 0.06, 1, 0.94), [480, 800]),
    "golden-cane-lawns-family-redlands": ("13zII1", (0, 0.02, 1, 0.80), [480, 800, 1200]),
}
BEFORE_AFTER = {
    "hedge-trimming-before-after-wellington-point": "ba1",
    "hedge-trimming-before-after-ormiston": "ba2",
    "shrub-pruning-before-after-cleveland": "ba3",
    "garden-maintenance-before-after-thornlands": "ba4",
    "lawn-edging-before-after-capalaba": "ba5",
}

manifest = {}

def find(prefix):
    for f in os.listdir(RAW):
        if f.startswith(prefix):
            return os.path.join(RAW, f)
    raise SystemExit(f"missing source for {prefix}")

def save(im, slug, widths):
    im = im.convert("RGB")
    entry = {"w": im.width, "h": im.height, "files": []}
    for w in widths:
        if w > im.width:
            w = im.width
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        name = f"{slug}-{w}.webp"
        r.save(os.path.join(OUT, name), "WEBP", quality=74, method=6)
        entry["files"].append({"w": w, "h": h, "src": name})
    manifest[slug] = entry

for slug, (prefix, crop, widths) in PHOTOS.items():
    im = ImageOps.exif_transpose(Image.open(find(prefix)))
    if crop:
        W, H = im.size
        im = im.crop((int(crop[0]*W), int(crop[1]*H), int(crop[2]*W), int(crop[3]*H)))
    save(im, slug, widths)

for slug, key in BEFORE_AFTER.items():
    b = Image.open(os.path.join(BA, f"{key}-before.jpg"))
    a = Image.open(os.path.join(BA, f"{key}-after.jpg"))
    # Both halves must share a frame for the drag slider.
    w, h = min(b.width, a.width), min(b.height, a.height)
    for label, im in (("before", b), ("after", a)):
        im = ImageOps.fit(im, (w, h), Image.LANCZOS)
        save(im, f"{slug}-{label}", [480, 960, 1400])

json.dump(manifest, open(os.path.join(OUT, "manifest.json"), "w"), indent=1)
print(len(manifest), "images;", sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT)) // 1024, "KB total")
