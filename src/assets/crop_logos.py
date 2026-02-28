import cv2
import numpy as np
import os

img_path = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\extracted_images\page2_img1.png"
output_dir = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\images\logos"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

img = cv2.imread(img_path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

_, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

cards = []
for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    area = w * h
    if area > 10000:
        cards.append((x, y, w, h))

cards.sort(key=lambda item: item[0])

def crop_and_trim(roi, name):
    roi_gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    _, roi_thresh = cv2.threshold(roi_gray, 240, 255, cv2.THRESH_BINARY_INV)
    pts = cv2.findNonZero(roi_thresh)
    if pts is not None:
        rx, ry, rw, rh = cv2.boundingRect(pts)
        pad = 20
        rx = max(0, rx - pad)
        ry = max(0, ry - pad)
        rw = min(roi.shape[1] - rx, rw + pad * 2)
        rh = min(roi.shape[0] - ry, rh + pad * 2)
        cropped = roi[ry:ry+rh, rx:rx+rw]
        save_path = os.path.join(output_dir, name)
        cv2.imwrite(save_path, cropped)
        print(f"Saved {save_path}")

if len(cards) >= 5:
    crop_and_trim(img[cards[0][1]:cards[0][1]+cards[0][3], cards[0][0]:cards[0][0]+cards[0][2]], "herschell-logo.png")
    crop_and_trim(img[cards[1][1]:cards[1][1]+cards[1][3], cards[1][0]:cards[1][0]+cards[1][2]], "glue-devil-logo.png")
    crop_and_trim(img[cards[2][1]:cards[2][1]+cards[2][3], cards[2][0]:cards[2][0]+cards[2][2]], "spanjaard-logo.png")
    crop_and_trim(img[cards[3][1]:cards[3][1]+cards[3][3], cards[3][0]:cards[3][0]+cards[3][2]], "pratley-logo.png")
    
    c5_x, c5_y, c5_w, c5_h = cards[4]
    c5_roi = img[c5_y:c5_y+c5_h, c5_x:c5_x+c5_w]
    h_part = c5_h // 3
    
    crop_and_trim(c5_roi[0:h_part, :], "duram-logo.png")
    crop_and_trim(c5_roi[h_part:2*h_part, :], "paintchem-logo.png")
    crop_and_trim(c5_roi[2*h_part:, :], "repex-logo.png")
    
    print("Logos successfully extracted!")
else:
    print(f"Warning: Expected 5 cards, found {len(cards)}")
