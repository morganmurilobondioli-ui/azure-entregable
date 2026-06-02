from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images"
OUT.mkdir(parents=True, exist_ok=True)


def font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibrib.ttf" if bold else r"C:\Windows\Fonts\calibri.ttf",
    ]
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


def label(draw, text, xy, size=34):
    draw.text(xy, text, fill="#172033", font=font(size, True))


def laptop():
    img = Image.new("RGB", (900, 650), "#f3f7fb")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((150, 110, 750, 455), radius=28, fill="#172033")
    d.rounded_rectangle((180, 140, 720, 425), radius=12, fill="#7cc7ff")
    d.rectangle((185, 330, 715, 425), fill="#1769e0")
    d.polygon([(80, 500), (820, 500), (720, 565), (180, 565)], fill="#cbd5e1")
    d.rounded_rectangle((330, 510, 570, 535), radius=10, fill="#94a3b8")
    d.text((225, 210), "Laptop Pro 14", fill="white", font=font(45, True))
    label(d, "Intel i5 · 16 GB · SSD", (240, 585), 30)
    img.save(OUT / "laptop-pro-14.png")


def phone():
    img = Image.new("RGB", (900, 650), "#f8fafc")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((310, 70, 590, 570), radius=44, fill="#172033")
    d.rounded_rectangle((330, 105, 570, 535), radius=28, fill="#e0f2fe")
    d.ellipse((390, 150, 470, 230), fill="#1769e0")
    d.ellipse((485, 150, 535, 200), fill="#138a66")
    d.rectangle((360, 285, 540, 305), fill="#94a3b8")
    d.rectangle((360, 330, 520, 350), fill="#cbd5e1")
    label(d, "Smartphone X5", (288, 590), 34)
    img.save(OUT / "phone-x5.png")


def headset():
    img = Image.new("RGB", (900, 650), "#f8fafc")
    d = ImageDraw.Draw(img)
    d.arc((235, 105, 665, 520), 190, 340, fill="#172033", width=34)
    d.rounded_rectangle((170, 310, 300, 505), radius=28, fill="#1769e0")
    d.rounded_rectangle((600, 310, 730, 505), radius=28, fill="#1769e0")
    d.line((665, 505, 735, 565), fill="#172033", width=18)
    d.ellipse((725, 548, 770, 593), fill="#138a66")
    label(d, "Headset Air", (320, 570), 38)
    img.save(OUT / "headset-air.png")


def tablet():
    img = Image.new("RGB", (900, 650), "#f8fafc")
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((200, 80, 700, 555), radius=36, fill="#172033")
    d.rounded_rectangle((230, 120, 670, 515), radius=18, fill="#fff7d6")
    d.rectangle((270, 170, 630, 195), fill="#1769e0")
    d.rectangle((270, 235, 585, 255), fill="#94a3b8")
    d.rectangle((270, 290, 610, 310), fill="#cbd5e1")
    d.line((660, 85, 760, 25), fill="#138a66", width=18)
    label(d, "Tablet Note", (335, 570), 38)
    img.save(OUT / "tablet-note.png")


def hero():
    img = Image.new("RGB", (1600, 900), "#edf4ff")
    d = ImageDraw.Draw(img)
    d.rectangle((0, 0, 1600, 900), fill="#edf4ff")
    d.rounded_rectangle((80, 120, 1500, 780), radius=34, fill="#ffffff", outline="#dbe3ef", width=6)
    d.rounded_rectangle((145, 205, 640, 655), radius=28, fill="#172033")
    d.rounded_rectangle((175, 240, 610, 610), radius=14, fill="#7cc7ff")
    d.rounded_rectangle((760, 230, 1020, 610), radius=40, fill="#1769e0")
    d.rounded_rectangle((1060, 280, 1320, 585), radius=30, fill="#ffd166")
    d.arc((1185, 210, 1460, 570), 190, 340, fill="#138a66", width=24)
    d.text((170, 675), "InnovVentas", fill="#172033", font=font(72, True))
    d.text((170, 755), "Asistencia inmediata para comprar tecnologia", fill="#334155", font=font(34, False))
    img.save(OUT / "store-hero.png")


if __name__ == "__main__":
    laptop()
    phone()
    headset()
    tablet()
    hero()
    print(f"imagenes generadas en {OUT}")
