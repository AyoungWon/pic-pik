# PicPik

PicPik은 Image 파일 선택시 파일에 대한 데이터와 meta 정보를 손쉽게 얻고, 사이즈를 변경 가능하게 해주는 오픈소스 라이브러리입니다.

# 목차

- [PicPik 소개](#picpik)
- [목차](#목차)
- [기능](#기능)
- [설치 방법](#설치-방법)
- [사용 예시](#사용-예시)
  - [readImageMetadata](#readimagemetadata)
    - [metadata](#metadata)
    - [limit](#limit)
  - [resizeImage](#resizeimage)
    - [resizeOption](#resizeoption)
- [상세 확인하기](#상세-확인하기)
  - [metadata 상세](#metadata-상세)
  - [limit 상세](#limit-상세)
    - [max 제한하기](#max-제한하기)
    - [onError](#onerror)
    - [unit](#unit)
  - [ResizeOption](#resizeoption-1)
    - [mode](#mode)
    - [stretch](#stretch)
    - [aspectRatio](#aspectratio)
- [License](#license)

# 기능

- 불러올 파일에 대한 width, height, 확장자, 파일 사이즈 제한 가능
- image 파일 데이터 제공(확장자, width, height, src, 파일 사이즈)
- 불러온 이미지에 대한 Resize 기능

# 설치 방법

```bash
npm install @pic-pik/core
```

<br/><br/>

# 사용 예시

## readImageMetadata

이미지 파일의 메타데이터를 읽어오는 함수입니다.

```typescript
//script
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const metadata = await readImageMetadata(file);
    console.log(metadata);
    // {width: 320, height: 400, extension:'jpg', name:'test1.jpg',src:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'}
  }
};

const fileInput = document.querySelector("input#file-input");
fileInput.addEventListener("change", handleFileChange);

//html
<input type="file" accept="image/*" />;
```

### metadata

`metadata`는 이미지 파일과 관련된 기본적인 정보를 담고있습니다. [metadata 상세](#metadata-상세)

### limit

`limit`으로 `width`, `height`, `size(용량)`을 제한할 수 있습니다. [limit 상세](#limit_상세)

```typescript
//script

const limit = {
  width: 500,
  height: {
    max: 1000,
    onError: (error) => {
      console.log(error);
      // {field:"height", max: 1000, selectedFileValue: 3600}
    },
  },
  size: 1024,
};

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const metadata = await readImageMetadata(file, limit);
  }
};

const fileInput = document.querySelector("input#file-input");
fileInput.addEventListener("change", handleFileChange);

//html
<input type="file" accept="image/*" />;
```

<br/><br/>

## resizeImage

원본 파일의 [metadata](#metadata-상세)와 [resizeOption](#resizeoption)을 전달하면 resize된 `File` 객체를 return 하는 함수입니다.

```typescript
const option: ResizeOption = {
  mode: "aspectRatio",
  scale: 0.2,
};

const resizedFile = await resizeImage(metadata, option);
```

### resizeOption

`resizeOption`은 비율로 변경 하는 방법과 `width`, `height`으로 강제로 변경하는 방법이 있습니다. 자세한 option 사항은 [resizeOption 상세](#resizeoption)를 참고해주세요.

<br/><br/>

# 상세 확인하기

## metadata 상세

`metadata`는 해당 이미지에서 활용하기 좋은 기본적인 정보를 포함하고 있습니다.

```js
console.log(metadata);
//{width: 320, height: 400, extension:'jpg', name:'test1.jpg',src:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...', size: 202399}
```

- width : 해당 이미지의 width(px)
- height : 해당 이미지의 height(px)
- extension : 해당 이미지의 확장자
- name : 해당 이미지 파일의 파일명
- src : 이미지 파일의 데이터가 Base64 인코딩된 데이터 URL 형식의 값, 이미지 미리보기 등에 활용
- size: 파일의 크기(byte)

## limit 상세

`limit`로 제한할 있는 필드는 `width`, `height`, `size` 총 3가지 입니다. 각 필드는 `optional`값이므로 필요한 경우에만 사용할 수 있습니다.

### max 제한하기

모든 필드는 값과 객체, 2가지 방법으로 제한할 수 있습니다.

```js
// max 값으로 제한하기
const limit = { width: 300, height: 500, size: 1024 };
const limit = { height: 500, size: 1024 };
const limit = { width: 300 };
const limit = { height: 500 };
```

```js
// condition 객체로 제한하기
const limit = {
  width: { max: 300, onError: (error) => console.log("width error", error) },
  height: { max: 5000 },
};

// max와 condition 객체 홉합 사용
const limit = {
  width: 500,
  height: { max: 5000, onError: (error) => console.log("height error", error) },
};
```

### onError

`limit`의 항목에 `condition` 객체를 사용하고, `max`값을 초과할 경우 실행되는 `onError`가 실행됩니다. `onError`의 인자로 전달되는 `error` 객체의 내용은 다음과 같습니다.

```js
limit={{
    width: {
      max: 3000,
      onError: (error) => {
        console.log(error);
        // {field:"width", max: 3000, selectedFileValue: 3600}
      },
    },
    height: 3000,
  }}
```

- `field`: error가 발생한 필드 값
- `max`: 제한한 값
- `selectedFileValue`: 선택된 파일의 해당 필드 값

`condition` 객체의 `onError`는 `optional` 값이며, 입력하지 않을 경우 default 함수는 다음과 같습니다.

```js
() =>
  console.error(
    `이미지 파일의 ${field}는 ${max}${unit ?? ""}보다 작거나 같아야합니다.`
  );

// ex
// 이미지 파일의 width는 500px보다 작거나 같아야합니다.
// 이미지 파일의 size는 1024bytes보다 작거나 같아야합니다.
```

### unit

각 필드에 해당하는 단위는 다음과 같습니다.

- `width`: `px`
- `height`: `px`
- `size`: `byte`

## ResizeOption

이미지를 resize할때 어떤 방식과, 사이즈로 변경할지 지정하는 값입니다.

### mode

`mode`는 2가지가 있습니다. `mode`에 알맞는 변화시킬 값을 지정해줘야합니다.

- `stretch` : 원본 이미지의 비율에 상관없이 지정한 값으로 이미지 사이즈가 변경됨
- `aspectRatio` : 원본 이미지의 비율을 유지한 상태로 지정한 값에 맞춰 나머지도 함께 변경됨

### stretch

- `stretch` 모드의 경우 `width`, `height`을 지정할 수 있습니다. 각각의 `width`, `height`을 모두 지정할 수 있고, 혹은 1개만 지정할 수도 있습니다.

```js
const file = await resizeImage(
  metadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  { mode: "stretch", height: 200 }
);

//반환된 리사이즈 이미지는 width = 100px, height = 200px의 1:2 비율
```

```js
const file = await resizeImage(
  metadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  { mode: "stretch", width: 200 }
);

//반환된 리사이즈 이미지는 width = 200px, height = 100px의 1:2 비율
```

```js
const file = await resizeImage(
  metadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  { mode: "stretch", height: 200, width: 300 }
);

//반환된 리사이즈 이미지는 width = 200px, height = 300px의 2:3 비율
```

### aspectRatio

- `aspectRatio` 모드의 경우 `width`, `height`, `scale`을 지정할 수 있으며, 3개 중의 한개의 값만 사용할 수 있습니다.

- `scale`의 경우 원본 사이즈를 1로 보고 0.5일 경우 50%의 크기, 2일 경우 200% 크기를 의미합니다.

```js
const file = await resizeImage(
  metadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  { mode: "aspectRatio", height: 200 }
);
//반환된 리사이즈 이미지는 width = 200px, height = 200px의 1:1 비율
```

```js
const file = await resizeImage(
  metadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  { mode: "aspectRatio", width: 50 }
);
//반환된 리사이즈 이미지는 width = 50px, height = 50px의 1:1 비율
```

```js
const file = await resizeImage(
  metadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  { mode: "aspectRatio", scale: 0.2 }
);
//반환된 리사이즈 이미지는 width = 20px, height = 20px의 1:1 비율
```

# License

This project is licensed under the terms of the MIT license.
