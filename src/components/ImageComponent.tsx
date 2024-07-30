/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

interface ImageComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  rounded?: boolean;
  borderColor?: string;
}

const StyledImage = styled.img<{ rounded: boolean; borderColor: string }>`
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  border-radius: ${(props) => (props.rounded ? '50%' : '0')};
  border: 2px solid ${(props) => props.borderColor};
`;

const ImageComponent: React.FC<ImageComponentProps> = ({
  src,
  alt,
  width = 100,
  height = 100,
  className,
  rounded = false,
  borderColor = 'black'
}) => {
  return (
    <StyledImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      rounded={rounded}
      borderColor={borderColor}
    />
  );
};

export default ImageComponent;
