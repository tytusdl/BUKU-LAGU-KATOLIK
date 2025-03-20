import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const splashXml = `
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <circle cx="200" cy="200" r="195" fill="#2B5937" stroke="gold" stroke-width="5"/>
  <path d="M200 60 L200 340" stroke="gold" stroke-width="20" />
  <path d="M120 200 L280 200" stroke="gold" stroke-width="20" />
  <circle cx="200" cy="200" r="150" fill="none" stroke="white" stroke-width="2" stroke-dasharray="5,5"/>
  <path d="M200 340 C160 300, 140 250, 140 200 C140 150, 160 100, 200 60" fill="none" stroke="white" stroke-width="2"/>
  <path d="M200 340 C240 300, 260 250, 260 200 C260 150, 240 100, 200 60" fill="none" stroke="white" stroke-width="2"/>
  <circle cx="200" cy="260" r="15" fill="white"/>
  <circle cx="200" cy="140" r="15" fill="white"/>
  <circle cx="260" cy="200" r="15" fill="white"/>
  <circle cx="140" cy="200" r="15" fill="white"/>
  <circle cx="235" cy="235" r="15" fill="white"/>
  <circle cx="165" cy="165" r="15" fill="white"/>
  <circle cx="235" cy="165" r="15" fill="white"/>
  <circle cx="165" cy="235" r="15" fill="white"/>
</svg>
`;

export const SplashIcon = ({ width = 200, height = 200 }) => (
  <SvgXml xml={splashXml} width={width} height={height} />
); 