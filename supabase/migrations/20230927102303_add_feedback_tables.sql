create table "public"."qualitative_feedback" (
    "id" bigint generated by default as identity not null,
    "interviewId" bigint not null,
    "title" character varying,
    "evaluation" character varying,
    "citation" character varying,
    "is_positive" boolean,
    "suggestion" character varying,
    "score" smallint
);


create table "public"."quantitative_feedback" (
    "id" bigint generated by default as identity not null,
    "interviewId" bigint,
    "metric" character varying,
    "evaluation" character varying,
    "score" smallint
);


alter table "public"."interview" add column "hasEnded" boolean not null default false;

CREATE UNIQUE INDEX qualitative_feedback_pkey ON public.qualitative_feedback USING btree (id);

CREATE UNIQUE INDEX quantitative_feedback_pkey ON public.quantitative_feedback USING btree (id);

alter table "public"."qualitative_feedback" add constraint "qualitative_feedback_pkey" PRIMARY KEY using index "qualitative_feedback_pkey";

alter table "public"."quantitative_feedback" add constraint "quantitative_feedback_pkey" PRIMARY KEY using index "quantitative_feedback_pkey";

alter table "public"."qualitative_feedback" add constraint "qualitative_feedback_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES interview(id) not valid;

alter table "public"."qualitative_feedback" validate constraint "qualitative_feedback_interviewId_fkey";

alter table "public"."quantitative_feedback" add constraint "quantitative_feedback_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES interview(id) not valid;

alter table "public"."quantitative_feedback" validate constraint "quantitative_feedback_interviewId_fkey";

