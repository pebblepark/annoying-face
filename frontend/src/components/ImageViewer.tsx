import React, {
  ImgHTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

type ImageViewerContextType = {
  src?: string;
  onChange: (src?: string) => void;
};

const ImageViewerContext = React.createContext<ImageViewerContextType | null>(
  null
);

const ImageViewer = ({ children }: { children: React.ReactNode }) => {
  const [src, setSrc] = useState<string>();
  const onChange = useCallback((src?: string) => setSrc(src), []);

  return (
    <ImageViewerContext.Provider value={{ src, onChange }}>
      {children}
    </ImageViewerContext.Provider>
  );
};

const useImageViewContext = () => {
  const context = useContext(ImageViewerContext);
  if (!context) {
    throw new Error('ImageViewer 컴포넌트를 찾을 수 없습니다.');
  }
  return context;
};

const Image = (
  props: ImgHTMLAttributes<HTMLImageElement> & { isLoading?: boolean }
) => {
  const { isLoading } = props;
  const { src } = useImageViewContext();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!src) return;

    if (imgRef.current) {
      imgRef.current.src = src;
    }
  }, [src]);

  if (isLoading) return <img src='loading.png' className='loading' />;

  return <img {...props} ref={imgRef} />;
};

const Controls = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  if (!className) return <>{children}</>;
  return <div className={className}>{children}</div>;
};

const Control = ({
  children,
}: {
  children: (
    param: Pick<ImageViewerContextType, 'onChange'>
  ) => React.ReactElement;
}) => {
  const { onChange } = useImageViewContext();
  return children({ onChange });
};

ImageViewer.Image = Image;
ImageViewer.Controls = Controls;
ImageViewer.Control = Control;

export default ImageViewer;
