import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #261d55 0%, #0b0d13 72%, #05060a 100%)",
        }}
      >
        <svg
          width="128"
          height="128"
          viewBox="-45 -83 656 656"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M262.5 235.5L283 196.799L398.5 0H566L453 196.799H381.5L358 156.84H429L495.5 40.4587H422.5L247 344.149L283 407.584L404 198.298L428 238.756L283 490L199 344.149L262.5 235.5Z"
            fill="#F4F2ED"
          />
          <path
            d="M70 40.4587L222 302.192H174.5L0 0H167.5L283 196.799L262.5 235.5L144 40.4587H70Z"
            fill="#5846CA"
          />
        </svg>
      </div>
    ),
    size,
  );
}
