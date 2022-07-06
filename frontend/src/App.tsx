import { useEffect, useState } from 'react';
import ImageUploadButton from './components/ImageUploadButton';
import ImageViewer from './components/ImageViewer';
import './App.scss';

function App() {
  const [client, setClient] = useState<File>();
  const [model, setModel] = useState<File>();

  return (
    <div className='container'>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Client onSelect={setClient} />
        <Model onSelect={setModel} />
      </div>
      <Result client={client} model={model} />
    </div>
  );
}

const MODEL_IMAGE_FOLDER = 'models';

const modelList = [
  { path: 'orange.jpg', points: [], name: '오렌지' },
  { path: 'green_apple.jpg', points: [], name: '풋사과' },
  { path: 'apple.jpg', points: [], name: '사과' },
  { path: 'tomato.jpg', points: [], name: '토마토' },
  { path: 'potato.jpg', points: [], name: '감자' },
].map((modelImg) => ({
  ...modelImg,
  path: `${MODEL_IMAGE_FOLDER}/${modelImg.path}`,
}));

const Model = ({ onSelect }: { onSelect: (file: File) => void }) => {
  useEffect(() => {
    convertURLtoFile(modelList[0].path).then((url) => onSelect(url));
  }, []);

  const convertURLtoFile = async (url: string) => {
    const response = await fetch(url);
    const data = await response.blob();
    const ext = url.split('.').pop();
    const filename = url.split('/').pop();
    const metadata = { type: `image/${ext}` };
    return new File([data], filename!, metadata);
  };

  return (
    <div className='preview-wrapper'>
      <h2>모델 이미지</h2>
      <ImageViewer>
        <ImageViewer.Image className='image' src={modelList[0].path} />
        <ImageViewer.Controls>
          <ImageViewer.Control>
            {({ onChange }) => (
              <select
                className='option'
                onChange={(e) => {
                  const url = e.target.value;
                  onChange(url);
                  convertURLtoFile(url).then((response) => onSelect(response));
                }}
              >
                {modelList.map(({ path, name }) => (
                  <option value={path} key={path}>
                    {name}
                  </option>
                ))}
              </select>
            )}
          </ImageViewer.Control>
        </ImageViewer.Controls>
      </ImageViewer>
    </div>
  );
};

const Client = ({ onSelect }: { onSelect: (file: File) => void }) => {
  const UploadButton = ({ onChange }: { onChange: (src: string) => void }) => {
    return (
      <ImageUploadButton
        onChange={(file: File) => {
          onChange(URL.createObjectURL(file));
          onSelect(file);
        }}
      >
        <span className='option'>업로드</span>
      </ImageUploadButton>
    );
  };

  return (
    <div className='preview-wrapper'>
      <h2>클라이언트 이미지</h2>
      <ImageViewer>
        <ImageViewer.Image className='image' />
        <ImageViewer.Controls>
          <ImageViewer.Control>
            {({ onChange }) => <UploadButton onChange={onChange} />}
          </ImageViewer.Control>
        </ImageViewer.Controls>
      </ImageViewer>
    </div>
  );
};

const Result = ({ client, model }: { client?: File; model?: File }) => {
  const [isSuccess, setSuccess] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const fetchApi = async () => {
    if (!client || !model) {
      alert('클라이언트 사진을 선택해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('client', client);
    formData.append('model', model);

    setLoading(true);
    return new Promise<string>(async (resolve) => {
      await fetch('https://annoying-face-api.herokuapp.com/api', {
        method: 'POST',
        body: formData,
      })
        .then(async (response) => {
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message);
          }
          return response.blob();
        })
        .then((blob) => {
          const imageObjectURL = URL.createObjectURL(blob);
          setSuccess(true);
          resolve(imageObjectURL);
        })
        .catch((error) => alert(error))
        .finally(() => setLoading(false));
    });
  };

  return (
    <div className='preview-wrapper'>
      <h2>결과보기</h2>
      <ImageViewer>
        <ImageViewer.Controls>
          <ImageViewer.Control>
            {({ onChange }) => (
              <button
                className='option'
                onClick={async () => {
                  const resultUrl = await fetchApi();
                  onChange(resultUrl);
                }}
              >
                합성
              </button>
            )}
          </ImageViewer.Control>
        </ImageViewer.Controls>
        <ImageViewer.Image
          className={`${isSuccess ? 'image' : ''}`}
          isLoading={isLoading}
        />
      </ImageViewer>
    </div>
  );
};

export default App;
