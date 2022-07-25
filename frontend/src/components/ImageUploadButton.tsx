const ImageUploadButton = ({
  onChange,
  children,
}: {
  onChange: (file: File) => void;
  children: React.ReactNode;
}) => {
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    onChange(files[0]);
  };

  return (
    <>
      <label htmlFor='image-upload-input'>{children}</label>
      <input
        className='hidden'
        type='file'
        id='image-upload-input'
        accept='image/*'
        onChange={onFileChange}
      />
    </>
  );
};

export default ImageUploadButton;
