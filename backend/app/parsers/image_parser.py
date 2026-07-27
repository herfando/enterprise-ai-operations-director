from PIL import Image, ImageEnhance, ImageFilter
import pytesseract


pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


def extract_image_text(file_path):

    image = Image.open(file_path)


    # convert grayscale
    image = image.convert("L")


    # perbesar
    image = image.resize(
        (
            image.width * 3,
            image.height * 3
        )
    )


    # tingkatkan kontras
    image = ImageEnhance.Contrast(image).enhance(2)


    # threshold
    image = image.point(
        lambda x: 0 if x < 160 else 255
    )


    text = pytesseract.image_to_string(
        image,
        config="--psm 6"
    )


    return text