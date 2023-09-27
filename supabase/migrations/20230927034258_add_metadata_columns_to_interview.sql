ALTER TABLE "public"."interview"
ADD COLUMN company TEXT,
ADD COLUMN job_title TEXT,
ADD COLUMN market_analysis TEXT,
ADD COLUMN hm_guidelines TEXT,
ADD COLUMN meta_instructions TEXT,
ADD COLUMN suitability_analysis TEXT,
ADD COLUMN is_setup_complete BOOLEAN NOT NULL DEFAULT FALSE;


