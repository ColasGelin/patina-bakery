import React from "react";

type CarouselProps = {
    photoScrollOffset: number;
};

const photos = [
    { src: "/images/1.jpg", alt: "Bakery Photo 1" },
    { src: "/images/2.jpg", alt: "Bakery Photo 2" },
    { src: "/images/3.png", alt: "Bakery Photo 3" },
    { src: "/images/1.jpg", alt: "Bakery Photo 4" },
    { src: "/images/2.jpg", alt: "Bakery Photo 5" },
    { src: "/images/3.png", alt: "Bakery Photo 6" },
    { src: "/images/1.jpg", alt: "Bakery Photo 7" },
    { src: "/images/2.jpg", alt: "Bakery Photo 8" },
];

export const Carousel: React.FC<CarouselProps> = ({ photoScrollOffset }) => (
    <div
        style={{
            width: "100vw",
            height: "200px",
            overflow: "hidden",
            marginTop: "4rem",
            position: "relative",
        }}
    >
        <div
            style={{
                display: "flex",
                alignItems: "center",
                height: "100%",
                transform: `translateX(-${photoScrollOffset}px)`,
                transition: "transform 0.1s ease-out",
            }}
        >
            {photos.map((photo, idx) => (
                <div
                    key={idx}
                    style={{
                        minWidth: "300px",
                        height: "180px",
                        marginRight: "20px",
                        borderRadius: "5px",
                        overflow: "hidden",
                        position: "relative",
                    }}
                >
                    <img
                        src={photo.src}
                        alt={photo.alt}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </div>
            ))}
        </div>
    </div>
);
