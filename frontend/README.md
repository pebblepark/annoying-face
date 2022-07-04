# annoying-face

## Commit 메시지

참고 : [https://jae04099.tistory.com/entry/GIT-커밋에-관하여좋은-커밋-메시지-커밋-타이밍-등](https://jae04099.tistory.com/entry/GIT-%EC%BB%A4%EB%B0%8B%EC%97%90-%EA%B4%80%ED%95%98%EC%97%AC%EC%A2%8B%EC%9D%80-%EC%BB%A4%EB%B0%8B-%EB%A9%94%EC%8B%9C%EC%A7%80-%EC%BB%A4%EB%B0%8B-%ED%83%80%EC%9D%B4%EB%B0%8D-%EB%93%B1)

- 구조
    - 타입은 필수, 바디와 푸터는 옵션
    - 타이틀은 커밋이 수행 한 작업에 대해 명령형으로 작성
    - `어떻게`가 아닌 `무엇을` , 그리고 `왜`에 대한 설명을 위해 바디를 사용
    - 이슈트래커 아이디 참조로 푸터를 사용

```
type: Subject

body

footer
```

- type

```
Feat : 새로운 기능의 추가
Fix: 버그 수정
Docs: 문서 수정
Style: 스타일 관련 기능(코드 포맷팅, 세미콜론 누락, 코드 자체의 변경이 없는 경우)
Refactor: 코드 리펙토링
Test: 테스트 코트, 리펙토링 테스트 코드 추가
Chore: 빌드 업무 수정, 패키지 매니저 수정(ex .gitignore 수정 같은 경우)
```

- 예시

```
Fix: CardList 컴포넌트 클릭 시 공백으로 나오는 오류 수정

모바일 버전에서 CardList의 img 부분 클릭 시 공백으로 나오는 오류 수정.
PC버전은 이상없음.

Resolves: #232
```
