# PicPik

PicPik은 image 파일 선택시 파일에 대한 데이터와 meta 정보를 손쉽게 얻을 수 있게 하는 오픈소스 라이브러리입니다.

# 기본 기능

- image 파일 데이터 제공(확장자, width, height, src, 파일 사이즈)
- 파일에 대한 width, height, 확장자, 파일 사이즈 제한 가능

# 설치 방법

```bash
npm install pic-pik
```

# 사용 예시

## ImageUploader 컴포넌트를 사용하기

```js
<ImageUploader
  accept=".jpg, .jpeg"
  onMetadataLoaded={(data) => {
    console.log(data);
  }}
  validateOptions={{
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
</ImageUploader>
```

### accept(optional, default: image/\*)

`accept`를 사용하여 허용할 이미지 파일 확장자를 지정합니다.

```js
<ImageUploader
  accept=".jpg, .jpeg" // .png, .webp, .gif...
>
  Select
</ImageUploader>
```

### validateOptions(optional)

`validateOptions`으로 `width, height, size(용량)`을 제한할 수 있습니다.

```js
<ImageUploader
  validateOptions={{
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

각 항목의 형태는 `number`이거나 `{max:number, onError?:(error:ValidateError)=>void}`형태입니다.

### onMetadataLoaded

`onMetadataLoaded`를 이용하여 image 파일 선택후 파일의 `metadata`를 알아 낼 수 있습니다.

```js
<ImageUploader
  accept=".jpg, .jpeg"
  onMetadataLoaded={(data) => {
    console.log(data);
    // result: {width: 320, height: 400, extension:'jpg', name:'test1.jpg',src:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'}
  }}
>
  <button>Select Image File</button>
</ImageUploader>
```

## useImageMetadata hook 사용하기

`useImageMetadata`를 사용하여 자유롭게 `input`을 커스터마이징 할 수 있습니다.

```js
const { ref, imageMetadata } = useImageMetadata({
  validateOptions: {
    width: 1000,
    height: { max: 2000, onError: (error) => console.log(error) },
  },
});

return (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <input ref={ref} type="file" accept=".jpg, .jpeg" />
    {imageMetadata && (
      <img
        style={{ width: imageMetadata.width, height: imageMetadata.height }}
        src={imageMetadata.src}
        alt="image file"
      />
    )}
  </div>
);
```

### ref

`input` 태그의 ref에 `useImageMetadata`로부터 받은 `ref`를 전달합니다.

```js
const { ref } = useImageMetadata();

return <input ref={ref} type="file" accept=".jpg, .jpeg" />;
```

### imageMetadata

`ref`로 참조한 file `input`을 사용하여 파일을 선택한 경우, `imageMetadata`로 해당 이미지 파일의 관련 metadata를 조회 수 있습니다.

```js
const { ref, imageMetadata } = useImageMetadata();

useEffect(() => {
  if (imageMetadata) console.log(imageMetadata);
  // result: {width: 320, height: 400, extension:'jpg', name:'test1.jpg',src:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...'}
}, [imageMetadata]);

return <input ref={ref} type="file" accept=".jpg, .jpeg" />;
```

### validateOptions

`useImageMetadata`에 v`alidateOptions`를 전달하여, `width, height, size(용량)`에 대한 제한과 에러 처리를 할 수 있습니다.

```js
const { ref, imageMetadata } = useImageMetadata({
  validateOptions: {
    width: 1000,
    height: { max: 2000, onError: (error) => console.log(error) },
  },
});
```
