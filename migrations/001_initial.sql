CREATE TABLE IF NOT EXISTS interest_signups (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 email text UNIQUE NOT NULL CHECK (length(email) <= 254),
 deletion_hash text NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS rate_windows (
 bucket text PRIMARY KEY,
 count integer NOT NULL,
 expires_at timestamptz NOT NULL
);
CREATE TABLE IF NOT EXISTS daily_metrics (
 day date NOT NULL DEFAULT current_date,
 event text NOT NULL CHECK (event IN ('parsed','matched','interest')),
 count integer NOT NULL DEFAULT 0,
 PRIMARY KEY(day,event)
);
