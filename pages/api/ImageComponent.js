import Image from 'next/image';

const isProduction = process.env.NODE_ENV === 'production';

const ImageComponent = ({ src, alt, style = {} }) => {
  if (isProduction) {
    return <img src={src} alt={alt} style={{ width: '100%', height: '100%', ...style }} />;
  } else {
    return (
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        quality={75}
        sizes="(max-width: 768px) 100vw, 
               (max-width: 1200px) 50vw, 
               33vw"
        placeholder="blur"
        blurDataURL="../public/placeholder.webp"
        loading="lazy"
        style={style}
      />
    );
  }
};

export default ImageComponent;
