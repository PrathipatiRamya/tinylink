import "./globals.css";

export const metadata = {
  title: "TinyLink",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main className="container">{children}</main>

        <footer
          className="container"
          style={{ marginTop: "30px", color: "#777" }}
        >
          Built for TinyLink assignment
        </footer>
      </body>
    </html>
  );
}
