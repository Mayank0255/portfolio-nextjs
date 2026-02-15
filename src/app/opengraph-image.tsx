import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mayank Aggarwal — SDE 3 at Zomato Ads";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #0f0f13 0%, #1a1b23 40%, #1e1f28 100%)",
          padding: "60px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Left: Avatar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "200px",
            height: "200px",
            borderRadius: "100px",
            border: "4px solid #93c5fd",
            overflow: "hidden",
            flexShrink: 0,
            marginRight: "50px",
            marginTop: "auto",
            marginBottom: "auto",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://mayankaggarwal.com/images/avatar.png"
            alt="Mayank Aggarwal"
            width={200}
            height={200}
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Right: Text Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flex: 1,
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "#f3f4f6",
              lineHeight: 1.1,
              marginBottom: "12px",
            }}
          >
            Mayank Aggarwal
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#93c5fd",
              marginBottom: "24px",
            }}
          >
            SDE 3 @ Zomato Ads
          </div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "28px",
            }}
          >
            {["350k RPM", "Golang", "React.js", "Apache Flink"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  border: "1px solid #4a4d5e",
                  color: "#a5aab6",
                  fontSize: "18px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "#6b7280",
              lineHeight: 1.5,
            }}
          >
            Building high-performance ad delivery systems · Manipal University Jaipur
          </div>
        </div>

        {/* Bottom-right: URL */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "60px",
            fontSize: "18px",
            color: "#4a4d5e",
          }}
        >
          mayankaggarwal.com
        </div>
      </div>
    ),
    { ...size },
  );
}
