CREATE TABLE links (
    id SERIAL PRIMARY KEY,
    code VARCHAR(8) UNIQUE NOT NULL,
    url TEXT NOT NULL,
    clicks INT DEFAULT 0,
    last_clicked TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

SELECT * from links;

CREATE TABLE IF NOT EXISTS clicks (
  id SERIAL PRIMARY KEY,
  code VARCHAR(10) REFERENCES links(code) ON DELETE CASCADE,
  clicked_at TIMESTAMP DEFAULT NOW()
);

select * from clicks;

