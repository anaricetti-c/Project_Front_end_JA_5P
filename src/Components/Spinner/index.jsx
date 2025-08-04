import { LoaderWrapper, LoaderSvg, LoaderCircle } from './style';

export default function Spinner(mb = '0px') {
  return (
    <LoaderWrapper>
      <LoaderSvg viewBox="25 25 50 50">
        <LoaderCircle r="20" cy="50" cx="50" />
      </LoaderSvg>
    </LoaderWrapper>
  );
}
