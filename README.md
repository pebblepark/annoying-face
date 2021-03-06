# Annoying Face

## 화면
![annoying-face-screen](https://user-images.githubusercontent.com/59855468/180739442-69e2743c-6112-46e8-8b88-14621b8b1863.gif)

## API 명세
[Swagger Docs](https://annoying-face-api.herokuapp.com/api-docs)

```text
[POST] /api
```

- **request** : `form-data`
  |field|desc|
  |--|--|
  |client| 클라이언트 이미지 file|
  |model|모델 이미지 file|

- **response**
  |status| desc|
  |---|---|
  |200 | 이미지 파일|

## 커밋 메시지

| Type     | Description                                                                 |
| -------- | --------------------------------------------------------------------------- |
| Feat     | 새로운 기능을 추가한 경우                                                   |
| Fix      | 에러를 수정한 경우                                                          |
| Design   | CSS 등 UI 디자인을 변경한 경우                                              |
| BREAKING | CHANGE 중대한 API를 변경한 경우                                             |
| HOTFIX   | 급하게 치명적인 에러를 고친 경우                                            |
| Style    | 코드 포맷 변경을 하거나 세미 콜론 누락하여 추가하면서 코드 수정이 없는 경우 |
| Refactor | 코드를 리팩토링한 경우                                                      |
| Comment  | 주석을 추가하거나 변경한 경우                                               |
| Docs     | 문서를 수정한 경우                                                          |
| Test     | 테스트 코드를 추가, 변경, 리팩토링한 경우                                   |
| Chore    | 기타 변경사항 (빌드 스크립트 수정, 패키지 매니징 설정 등)                   |
| Rename   | 파일 or 폴더명 수정하거나 옮기는 경우                                       |
| Remove   | 파일을 삭제하는 작업만 수행한 경우                                          |
