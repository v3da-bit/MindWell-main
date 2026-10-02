// Never use @iconify/react inside this file.
import { ImageResponse } from 'next/og';

export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/x-icon';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
          borderRadius: '12%',
          overflow: 'hidden',
          fontSize: '40px',
          fontWeight: 'bold',
          color: 'white',
        }}
      >
        {/* MindWell favicon with gradient background */}
        MW
      </div>
    ),
    {
      ...size,
    }
  );
}
