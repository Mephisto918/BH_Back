// PNG imports
import dark11_x16 from './1_1/dark/dark-16.png';
import dark11_x24 from './1_1/dark/dark-24.png';
import dark11_x32 from './1_1/dark/dark-32.png';
import dark11_x48 from './1_1/dark/dark-48.png';
import dark11_x64 from './1_1/dark/dark-64.png';
import dark11_x128 from './1_1/dark/dark-128.png';
import dark11_x256 from './1_1/dark/dark-256.png';
import dark11_x512 from './1_1/dark/dark-512.png';
import dark11_x1024 from './1_1/dark/dark-1024.png';
import light11_x16 from './1_1/light/light-16.png';
import light11_x24 from './1_1/light/light-24.png';
import light11_x32 from './1_1/light/light-32.png';
import light11_x48 from './1_1/light/light-48.png';
import light11_x64 from './1_1/light/light-64.png';
import light11_x128 from './1_1/light/light-128.png';
import light11_x256 from './1_1/light/light-256.png';
import light11_x512 from './1_1/light/light-512.png';
import light11_x1024 from './1_1/light/light-1024.png';

import dark32_x16 from './3_2/dark/dark-16x11.png';
import dark32_x24 from './3_2/dark/dark-24x17.png';
import dark32_x32 from './3_2/dark/dark-32x23.png';
import dark32_x48 from './3_2/dark/dark-48x34.png';
import dark32_x64 from './3_2/dark/dark-64x45.png';
import dark32_x128 from './3_2/dark/dark-128x90.png';
import dark32_x256 from './3_2/dark/dark-256x181.png';
import dark32_x512 from './3_2/dark/dark-512x361.png';
import dark32_x1024 from './3_2/dark/dark-1024x722.png';

import light32_x16 from './3_2/light/light-16x11.png';
import light32_x24 from './3_2/light/light-24x17.png';
import light32_x32 from './3_2/light/light-32x23.png';
import light32_x48 from './3_2/light/light-48x34.png';
import light32_x64 from './3_2/light/light-64x45.png';
import light32_x128 from './3_2/light/light-128x90.png';
import light32_x256 from './3_2/light/light-256x181.png';
import light32_x512 from './3_2/light/light-512x361.png';
import light32_x1024 from './3_2/light/light-1024x722.png';

// SVG imports (Vite + SVGR)
import Light11_svg from './1_1/light/light.svg?component';
import Dark11_svg from './1_1/dark/dark.svg?component';
import Light32_svg from './3_2/light/light.svg?component';
import Dark32_svg from './3_2/dark/dark.svg?component';

type Theme = 'light' | 'dark';
type Ratio = '1:1' | '3:2';
type Size = 16 | 24 | 32 | 48 | 64 | 128 | 256 | 512 | 1024;
type Type = 'png' | 'svg';

export type SvgComponent = React.FunctionComponent<
  React.SVGProps<SVGSVGElement>
>;

class LogoService {
  private logos: Record<
    Ratio,
    Record<Theme, Record<Size, string>> & { svg: Record<Theme, SvgComponent> }
  >;

  constructor() {
    this.logos = {
      '1:1': {
        light: {
          16: light11_x16,
          24: light11_x24,
          32: light11_x32,
          48: light11_x48,
          64: light11_x64,
          128: light11_x128,
          256: light11_x256,
          512: light11_x512,
          1024: light11_x1024,
        },
        dark: {
          16: dark11_x16,
          24: dark11_x24,
          32: dark11_x32,
          48: dark11_x48,
          64: dark11_x64,
          128: dark11_x128,
          256: dark11_x256,
          512: dark11_x512,
          1024: dark11_x1024,
        },
        svg: { light: Light11_svg, dark: Dark11_svg },
      },
      '3:2': {
        light: {
          16: light32_x16,
          24: light32_x24,
          32: light32_x32,
          48: light32_x48,
          64: light32_x64,
          128: light32_x128,
          256: light32_x256,
          512: light32_x512,
          1024: light32_x1024,
        },
        dark: {
          16: dark32_x16,
          24: dark32_x24,
          32: dark32_x32,
          48: dark32_x48,
          64: dark32_x64,
          128: dark32_x128,
          256: dark32_x256,
          512: dark32_x512,
          1024: dark32_x1024,
        },
        svg: { light: Light32_svg, dark: Dark32_svg },
      },
    };
  }

  public getAsset(
    ratio: Ratio,
    theme: Theme,
    sizeOrType: Size | Type,
  ): string | SvgComponent {
    if (sizeOrType === 'svg') {
      return this.logos[ratio].svg[theme]; // return the component, not JSX
    }
    return this.logos[ratio][theme][sizeOrType]; // PNG path
  }
}

export default new LogoService();
