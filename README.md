# PicPik

PicPik은 Image 파일 선택시 파일에 대한 데이터와 meta 정보를 손쉽게 얻고, 사이즈를 변경 가능하게 해주는 React 오픈소스 라이브러리입니다.

# 목차

- [PicPik 소개](#picpik)
- [목차](#목차)
- [기능](#기능)
- [설치 방법](#설치-방법)
- [사용 예시 : 이미지 파일 불러오기](#사용-예시--이미지-파일-불러오기)
  - [ImageLoader 컴포넌트를 사용하기](#imageloader-컴포넌트를-사용하기)
    - [accept](#accept)
    - [limit](#limit)
    - [onMetadataLoaded](#onmetadataloaded)
  - [useImage hook 사용하기](#imageloader-컴포넌트를-사용하기)
    - [ref](#ref)
    - [metadata](#metadata)
    - [limit](#limit-1)
- [사용 예시 : 이미지 리사이즈 하기](#사용-예시--이미지-리사이즈-하기)
  - [useResizeImage hook 사용하기](#useresizeimage-hook-사용하기)
  - [metadata 상세](#metadata-상세)
  - [limit 상세](#limit-상세)
    - [max 제한하기](#max-제한하기)
    - [onError](#onerror)
    - [unit](#unit)
  - [ResizeOption](#resizeoption)
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
npm install pic-pik
```

# 사용 예시 : 이미지 파일 불러오기

## ImageLoader 컴포넌트를 사용하기

ImageLoader를 컴포넌트 안에 본인이 원하는 요소와 디자인을 적용하여 자유롭게 커스텀 사용이 가능합니다.

```js
<ImageLoader
  accept=".jpg, .jpeg"
  onMetadataLoaded={(data) => {
    console.log(data);
  }}
  limit={{
    width: {
      max: 3000,
      onError: (error) => {
        console.log(error);
      },
    },
    height: 3000,
  }}
>
  <button>Select Image File</button>
  /* <div>
    <p>이미지의 제한 사이즈는 Width 3000px, height 3000px 이하입니다.</p>
    <p>이곳을 눌러서 파일을 선택해주세요</p>
  </div>
  //원하는 다른 요소 custom하게 사용 가능 */
</ImageLoader>
```

### accept

`accept`를 사용하여 허용할 이미지 파일 확장자를 지정합니다. <br/>
accept는 MDN의 accept 규칙을 따릅니다.[(HTML attribute: accept)](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/accept)

```js
<ImageLoader
  accept=".jpg, .jpeg" // .png, .webp, .gif... or image/*
>
  Select
</ImageLoader>
```

- `accept` 속성은 `optional`이며 `"image/*"`을 기본값으로 합니다.

```js
<ImageLoader //모든 Image파일 확장자를 받음
>
  Select
</ImageLoader>
```

### limit

`limit`으로 `width`, `height`, `size(용량)`을 제한할 수 있습니다. [limit 상세](#limit_상세)

```js
<ImageLoader
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
>
```

### onMetadataLoaded

`onMetadataLoaded`를 이용하여 image 파일 선택후 파일의 `metadata`를 알아 낼 수 있습니다.

```js
<ImageLoader
  accept=".jpg, .jpeg"
  onMetadataLoaded={(data) => {
    console.log(data);
    // result: {width: 320, height: 400, extension:'jpg', name:'test1.jpg',src:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'}
  }}
>
  <button>Select Image File</button>
</ImageLoader>
```

## useImage hook 사용하기

```typescript
type useImage = (params?:{limit?: Limit;}) => return {
    ref: React.RefObject<HTMLInputElement>;
    metadata: ImageMetadata | null;
    file: File | null;
    };
```

`useImage`를 사용하여 자유롭게 `input`을 커스터마이징 하고, `metadata`와 `file`객체를 얻을 수 있습니다.<br/>
※ Notice: 이미지 파일이 선택되지 않았을 경우 `useImage`가 return하는 `metadata`와 `file`값은 `null`입니다.

```js
const { ref, metadata } = useImage({
  limit: {
    width: 1000,
    height: { max: 2000, onError: (error) => console.log(error) },
  },
});

return (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <input ref={ref} type="file" accept=".jpg, .jpeg" />
    {metadata && (
      <img
        style={{ width: metadata.width, height: metadata.height }}
        src={metadata.src}
        alt="image file"
      />
    )}
  </div>
);
```

### ref

`input` 태그의 ref에 `useImage`로부터 받은 `ref`를 전달합니다.

- 이때 전달하는 `input`의 `type`은 `file`이여야 합니다.

```js
const { ref } = useImage();

return <input ref={ref} type="file" accept=".jpg, .jpeg" />;
```

### metadata

`ref`로 참조한 file `input`을 사용하여 파일을 선택한 경우, `metadata`로 해당 이미지 파일의 관련 `metadata`를 조회 수 있습니다.

```js
const { ref, metadata } = useImage();

useEffect(() => {
  if (metadata) console.log(metadata);
  // result: {width: 320, height: 400, extension:'jpg', name:'test1.jpg',src:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'}
}, [metadata]);

return <input ref={ref} type="file" accept=".jpg, .jpeg" />;
```

### file

`ref`로 참조한 file `input`을 사용하여 파일을 선택한 경우, `file`로 해당 이미지 파일의 `file` 객체를 조회 수 있습니다.

```js
const { ref, file } = useImage();

useEffect(() => {
  if (file) {
    //file 업로드 로직...
  }
}, [metadata]);

return <input ref={ref} type="file" accept=".jpg, .jpeg" />;
```

### limit

`useImage`에 `limit`를 전달하여, `width`, `height`, `size(용량)`에 대한 제한과 에러 처리를 할 수 있습니다. [limit 상세](#limit_상세)

```js
const { ref, metadata } = useImage({
  limit: {
    width: 1000,
    height: { max: 2000, onError: (error) => console.log(error) },
  },
});
```

# 사용 예시 : 이미지 리사이즈 하기

## useResizeImage hook 사용하기

```typescript
type UseResizeImage = (params: {
  metadata?: ImageMetadata | null;
  option?: ResizeOption;
}) => return{
    file: File | null;
    metadata: ImageMetadata | null;
}
```

[ImageLoader](#imageloader-컴포넌트를-사용하기) 혹은 [useImage](#useimage-hook-사용하기)를 통해 알아낸 `metadata`를 이용하여 이미지를 resize하는 것이 가능합니다.<br/>
resize하는 다양한 옵션은 [ResizeOption](#resizeoption)에서 확인 가능합니다.

```js
const { ref, metadata: originalMetadata } = useImage();
const { metadata } = useResizeImage({
  metadata: originalMetadata,
  option: { mode: "aspectRatio", scale: 0.2 },
});

return (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <input type="file" ref={ref} />
    {metadata && <img src={metadata.src} width={metadata.width} />}
  </div>
);
```

- `useResizeImage`를 통해서 resize된 이미지의 `metadata`와 `File` 객체를 얻을 수 있습니다.<br/>
  ※ Notice: params로 전달되는 `metadata`(resize 하기 전 이미지 파일의 metadata)가 없을 경우 `useResizeImage`가 return하는 `metadata`와 `file`값은 `null`입니다.

## metadata 상세

metadata는 해당 이미지에서 활용하기 좋은 기본적인 정보를 포함하고 있습니다.

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
const { metadata } = useResizeImage({
  metadata: originalMetadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  option: { mode: "stretch", height: 200 },
});

//반환된 리사이즈 이미지는 width = 100px, height = 200px의 1:2 비율
```

```js
const { metadata } = useResizeImage({
  metadata: originalMetadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  option: { mode: "stretch", width: 200 },
});

//반환된 리사이즈 이미지는 width = 200px, height = 100px의 1:2 비율
```

```js
const { metadata } = useResizeImage({
  metadata: originalMetadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  option: { mode: "stretch", height: 200, width: 300 },
});

//반환된 리사이즈 이미지는 width = 200px, height = 300px의 2:3 비율
```

### aspectRatio

- `aspectRatio` 모드의 경우 `width`, `height`, `scale`을 지정할 수 있으며, 3개 중의 한개의 값만 사용할 수 있습니다.

- `scale`의 경우 원본 사이즈를 1로 보고 0.5일 경우 50%의 크기, 2일 경우 200% 크기를 의미합니다.

```js
const { metadata } = useResizeImage({
  metadata: originalMetadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  option: { mode: "aspectRatio", height: 200 },
});
//반환된 리사이즈 이미지는 width = 200px, height = 200px의 1:1 비율
```

```js
const { metadata } = useResizeImage({
  metadata: originalMetadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  option: { mode: "aspectRatio", width: 50 },
});
//반환된 리사이즈 이미지는 width = 50px, height = 50px의 1:1 비율
```

```js
const { metadata } = useResizeImage({
  metadata: originalMetadata, //원본 이미지의 크기는 width = 100px, height = 100px의 1:1 비율
  option: { mode: "aspectRatio", scale: 0.2 },
});
//반환된 리사이즈 이미지는 width = 20px, height = 20px의 1:1 비율
```

# License

This project is licensed under the terms of the MIT license.
