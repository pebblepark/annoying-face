import { useEffect, useState } from 'react';
import ImageUploadButton from './components/ImageUploadButton';
import ImageViewer from './components/ImageViewer';

function App() {
  const [client, setClient] = useState<File>();
  const [model, setModel] = useState<File>();

  return (
    <div className='grid w-full h-full min-h-screen gap-10 p-6 py-3 text-white place-content-center md:grid-cols-2 lg:grid-cols-3 bg-slate-400'>
      <Client onSelect={setClient} />
      <Model onSelect={setModel} />
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
    <div className='flex flex-col items-center justify-between gap-5 p-4 text-black shadow-lg bg-slate-200 rounded-2xl'>
      <h2 className='m-4 text-2xl font-bold'>모델 이미지</h2>
      <ImageViewer>
        <ImageViewer.Image
          className='object-contain w-full h-auto rounded-md shadow-lg'
          src={modelList[0].path}
          alt='모델 이미지'
        />
        <ImageViewer.Controls>
          <ImageViewer.Control>
            {({ onChange }) => (
              <select
                className='inline-block px-5 py-3 m-3 rounded-md shadow-sm cursor-pointer bg-slate-300 focus:outline-none hover:scale-105'
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
        <a className='inline-block px-5 py-3 m-3 rounded-md shadow-sm cursor-pointer bg-slate-300 hover:scale-105'>
          업로드
        </a>
      </ImageUploadButton>
    );
  };

  return (
    <div className='flex flex-col items-center justify-between gap-5 p-4 text-black shadow-lg bg-slate-200 rounded-2xl'>
      <h2 className='m-4 text-2xl font-bold'>클라이언트 이미지</h2>
      <ImageViewer>
        <ImageViewer.Image
          className='object-contain w-full h-auto bg-white rounded-md shadow-lg aspect-square'
          src='http://upload.wikimedia.org/wikipedia/commons/c/ce/Transparent.gif'
          alt='클라이언트 이미지'
        />
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
          resolve(imageObjectURL);
        })
        .catch((error) => alert(error))
        .finally(() => setLoading(false));
    });
  };

  return (
    <div className='flex flex-col items-center justify-between col-span-1 gap-5 p-4 text-black shadow-lg bg-slate-200 md:col-span-2 lg:col-span-1 rounded-2xl'>
      <h2 className='m-4 text-2xl font-bold'>결과보기</h2>
      <ImageViewer>
        <ImageViewer.Image
          className='object-contain w-full h-auto bg-white rounded-md shadow-lg'
          isLoading={isLoading}
        />
        <ImageViewer.Controls>
          <ImageViewer.Control>
            {({ onChange }) => (
              <button
                className='inline-block px-5 py-3 m-3 rounded-md shadow-sm cursor-pointer bg-slate-300 enabled:hover:scale-105 disabled:opacity-75'
                onClick={async () => {
                  const resultUrl = await fetchApi();
                  onChange(resultUrl);
                }}
                disabled={isLoading}
              >
                합성
              </button>
            )}
          </ImageViewer.Control>
        </ImageViewer.Controls>
      </ImageViewer>
    </div>
  );
};

export default App;
