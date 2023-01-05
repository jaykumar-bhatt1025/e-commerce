--
-- PostgreSQL database dump
--

-- Dumped from database version 14.3 (Ubuntu 14.3-1.pgdg20.04+1)
-- Dumped by pg_dump version 14.3 (Ubuntu 14.3-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_OrderProductMappings_trackingStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_OrderProductMappings_trackingStatus" AS ENUM (
    'Ordered',
    'Confirmed',
    'Shipped',
    'OutForDelivery',
    'Delivered',
    'Cancel'
);


ALTER TYPE public."enum_OrderProductMappings_trackingStatus" OWNER TO postgres;

--
-- Name: enum_Orders_paymentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Orders_paymentType" AS ENUM (
    'COD',
    'InternetBanking'
);


ALTER TYPE public."enum_Orders_paymentType" OWNER TO postgres;

--
-- Name: enum_ProductOffers_offerType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_ProductOffers_offerType" AS ENUM (
    'Instant Discount',
    'Cashback'
);


ALTER TYPE public."enum_ProductOffers_offerType" OWNER TO postgres;

--
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'ADMIN',
    'SELLER',
    'USER'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

--
-- Name: enum_Users_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_status" AS ENUM (
    'PENDING',
    'APPROVED'
);


ALTER TYPE public."enum_Users_status" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Addresses" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "houseNo" integer NOT NULL,
    landmark character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    state character varying(255) NOT NULL,
    country character varying(255) NOT NULL,
    pincode character varying(255) NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Addresses" OWNER TO postgres;

--
-- Name: Brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Brands" (
    id uuid NOT NULL,
    "brandName" character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    is_archieved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Brands" OWNER TO postgres;

--
-- Name: Carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Carts" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    quantity integer NOT NULL,
    is_archieved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Carts" OWNER TO postgres;

--
-- Name: Categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Categories" (
    id uuid NOT NULL,
    "categoryName" character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    image character varying(255) NOT NULL,
    is_archieved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Categories" OWNER TO postgres;

--
-- Name: Complaints; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Complaints" (
    id uuid NOT NULL,
    title character varying(255),
    "complaintMsg" text,
    is_archieved boolean DEFAULT false,
    "userId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Complaints" OWNER TO postgres;

--
-- Name: FeedBacks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."FeedBacks" (
    id uuid NOT NULL,
    "feedbackDesc" character varying(255) NOT NULL,
    rating integer NOT NULL,
    "orderProductId" uuid NOT NULL,
    is_archieved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."FeedBacks" OWNER TO postgres;

--
-- Name: OrderProductMappings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."OrderProductMappings" (
    id uuid NOT NULL,
    "orderId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "trackingStatus" public."enum_OrderProductMappings_trackingStatus" DEFAULT 'Ordered'::public."enum_OrderProductMappings_trackingStatus" NOT NULL,
    quantity integer NOT NULL,
    "sellerId" uuid NOT NULL,
    price double precision NOT NULL,
    is_returned boolean DEFAULT false NOT NULL,
    is_archieved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."OrderProductMappings" OWNER TO postgres;

--
-- Name: Orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Orders" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    "addressId" uuid NOT NULL,
    "paymentId" character varying(255) DEFAULT NULL::character varying,
    "paymentType" public."enum_Orders_paymentType" NOT NULL,
    is_archieved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Orders" OWNER TO postgres;

--
-- Name: ProductOffers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ProductOffers" (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "offerType" public."enum_ProductOffers_offerType" NOT NULL,
    "maxAllowed" integer NOT NULL,
    "userId" uuid NOT NULL,
    "productId" uuid NOT NULL,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."ProductOffers" OWNER TO postgres;

--
-- Name: Products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Products" (
    id uuid NOT NULL,
    "productName" character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "productImage" character varying(255)[],
    price integer NOT NULL,
    quantity integer NOT NULL,
    commission double precision DEFAULT '0'::double precision NOT NULL,
    is_archieved boolean DEFAULT false,
    status boolean DEFAULT false,
    "brandId" uuid NOT NULL,
    "sellerId" uuid NOT NULL,
    "subCategoryId" uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Products" OWNER TO postgres;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: SubCategories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SubCategories" (
    id uuid NOT NULL,
    "subCategoryName" character varying(255) NOT NULL,
    description character varying(255) NOT NULL,
    "categoryId" uuid NOT NULL,
    is_archieved boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."SubCategories" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id uuid NOT NULL,
    "firstName" character varying(255) NOT NULL,
    "lastName" character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "contactNo" character varying(255) NOT NULL,
    avatar character varying(255) NOT NULL,
    role public."enum_Users_role" NOT NULL,
    "GSTNo" character varying(255) DEFAULT ''::character varying,
    "verifyToken" character varying(1234) DEFAULT NULL::character varying,
    "isVerified" boolean DEFAULT false NOT NULL,
    "isArchived" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: UsersOTPs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."UsersOTPs" (
    id uuid NOT NULL,
    "userId" uuid NOT NULL,
    otp integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."UsersOTPs" OWNER TO postgres;

--
-- Data for Name: Addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Addresses" (id, "userId", "houseNo", landmark, city, state, country, pincode, "isArchived", "createdAt", "updatedAt") FROM stdin;
ce621522-4175-44d8-8fbd-5479787568a7	becfb722-0fe4-4662-8d5a-c0d2e8463ca2	123	Manibhadra Campus	Surat	Gujarat	India	395010	f	2022-06-25 18:07:19.578+05:30	2022-06-25 18:07:19.578+05:30
ed1d34c3-002e-44ea-8f4d-a7701b66123c	56f2cccb-784e-4439-9f22-1b7fdb65a3d5	456	Ambika Heights	Surat	Gujarat	India	395012	f	2022-06-25 18:07:19.578+05:30	2022-06-25 18:07:19.578+05:30
9257f92d-e40f-4b90-bf24-379786b1ea87	becfb722-0fe4-4662-8d5a-c0d2e8463ca2	123	Manibhadra Campus	Surat	Gujarat	India	395012	f	2022-06-25 18:54:42.779+05:30	2022-06-25 18:54:42.779+05:30
d9b768ea-04d1-4fc2-a2c2-c89e609970e6	becfb722-0fe4-4662-8d5a-c0d2e8463ca2	123	Manibhadra Campus	Surat	Gujarat	India	395012	f	2022-06-25 18:55:21.895+05:30	2022-06-25 18:55:21.895+05:30
\.


--
-- Data for Name: Brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Brands" (id, "brandName", description, is_archieved, "createdAt", "updatedAt") FROM stdin;
52c7d7b5-896e-46ae-a8dd-4efe16f118a0	Nike	Name for the Greek Goddess of Victory.	f	2022-06-26 12:34:35.458+05:30	2022-06-26 12:34:35.458+05:30
ffe3bd35-0373-4094-8810-60d20c19a3bc	Coca-Cole	The two main ingredients were Coca leaves and Cola berries.	f	2022-06-26 12:34:53.08+05:30	2022-06-26 12:34:53.08+05:30
69ffce21-169f-485c-a57c-4b7f47b85d72	Pepsi	From the digestive enzyme 'pepsin'.	f	2022-06-26 12:35:08.047+05:30	2022-06-26 12:35:08.047+05:30
a2b05873-af2f-4a27-b5ae-16cdbeb9865e	Adidas	Named after owner Adolf Dassler whose nickname was Adi. Adi Dassler became Adidas.	f	2022-06-26 12:35:24.123+05:30	2022-06-26 12:35:24.123+05:30
212b1d0d-5a97-4860-b5ec-c7edaf8ff755	Intel	Short for integrated electronics	f	2022-06-26 12:35:39.31+05:30	2022-06-26 12:35:39.31+05:30
371b120f-4dbe-4f3e-aba7-48206bb6bb5d	Canon	Adapted from Kwanon (Japanese name of Buddhist Bodhisattva of Mercy).	f	2022-06-26 12:35:54.194+05:30	2022-06-26 12:35:54.194+05:30
1d8a65a4-1aee-4142-9284-38c10e6f225a	Amazon	CEO Jeff Bezos wanted a name starting with 'A'. He chose Amazon because it is the biggest river in the world, just what he wanted his company to be.	f	2022-06-26 12:36:13.257+05:30	2022-06-26 12:36:13.257+05:30
8c904adc-9f6e-4cd5-b6f1-5cd9a004eadf	Starbucks	Originally the name 'Peqoud' was suggested, the name of the ship from the novel. When it got rejected, they settled for 'Starbuck', the chief mate of that very ship.	f	2022-06-26 12:36:40.271+05:30	2022-06-26 12:36:40.271+05:30
1960143f-fe74-4d91-a510-3231cfee80b3	Fanta	The head of the German Coca-Cola team asked them to use their 'Fantasie' (imagination) to come up with the name. That did not take long though.	f	2022-06-26 12:36:59.27+05:30	2022-06-26 12:36:59.27+05:30
43d013a3-b61d-40d0-b6be-209cf8f4ce26	Arthur Health	Best in medicines	f	2022-06-26 12:39:11.328+05:30	2022-06-26 12:39:11.328+05:30
76d18646-dbe3-4303-b610-086a1b267cf4	Primal Books	Best in books	f	2022-06-26 12:39:32.932+05:30	2022-06-26 12:39:32.932+05:30
f65e19ec-f031-485a-b52d-75b9508953d2	VIVO	Best in Phones	f	2022-06-26 12:42:40.079+05:30	2022-06-26 12:42:40.079+05:30
ee3b6d8c-92d4-49bd-bf10-30317e25c11d	SAMSUNG	Best in Phones	f	2022-06-26 12:42:45.677+05:30	2022-06-26 12:42:45.677+05:30
02d6d740-ed75-4885-be03-73137ddbc067	NOKIA	Best in Phones	f	2022-06-26 12:42:50.921+05:30	2022-06-26 12:42:50.921+05:30
003426ec-ee07-497a-bef3-646546d669a5	ACCER	Best in Laptops	f	2022-06-26 12:43:01.855+05:30	2022-06-26 12:43:01.855+05:30
38f6c5f0-510a-4586-bf1a-f5689c22de2e	HP	Best in Laptops	f	2022-06-26 12:43:06.946+05:30	2022-06-26 12:43:06.946+05:30
bd3e488b-1bdc-4517-a9d8-d3b68c2c6176	DELL	Best in Laptops	f	2022-06-26 12:43:12.398+05:30	2022-06-26 12:43:12.398+05:30
13c985a3-6bb7-4c45-8f60-bebd414f0b67	Burger King	Best in Laptops	f	2022-06-26 12:43:28.171+05:30	2022-06-26 12:43:28.171+05:30
b639449a-b137-4c2f-b16e-1ca2cbeca619	NIrma	Best in glosarry	f	2022-06-26 12:43:42.637+05:30	2022-06-26 12:43:42.637+05:30
dd969702-7201-4547-bf23-a1ad722d0d0e	Bajah	Best in electronics	f	2022-06-26 12:44:11.632+05:30	2022-06-26 12:44:11.632+05:30
55fe5e27-7c38-4371-ae63-c2b2d1e4a600	Bajaj	Best in electronics	f	2022-06-26 12:44:16.894+05:30	2022-06-26 12:44:16.894+05:30
c14cf907-7a21-4ef7-8fdd-9861fe205448	England Petter	Best in clothes	f	2022-06-26 12:44:48.502+05:30	2022-06-26 12:44:48.502+05:30
2d104497-af5e-4dd0-bb5b-76981e5db594	Titan	Best in Watch	f	2022-06-26 12:45:00.069+05:30	2022-06-26 12:45:00.069+05:30
97dd0038-c7ac-4a88-b9e1-1a3796e70622	Ajanta	Best in Spactes	f	2022-06-26 12:45:28.756+05:30	2022-06-26 12:45:28.756+05:30
\.


--
-- Data for Name: Carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Carts" (id, "userId", "productId", quantity, is_archieved, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Categories" (id, "categoryName", description, image, is_archieved, "createdAt", "updatedAt") FROM stdin;
85251883-c6e7-4f69-8902-27075831590a	Electonics	This is electronics categories	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225150782.png	f	2022-06-26 12:02:36.872+05:30	2022-06-26 12:02:36.872+05:30
35ae6767-8c68-4e3d-8cac-b881b6a78f74	Fashion	This is fashion categories	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225286846.png	f	2022-06-26 12:05:05.607+05:30	2022-06-26 12:05:05.607+05:30
42292101-615c-463a-87d2-fb9a4ab00a0b	Travel	This is travels categories	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225395744.png	f	2022-06-26 12:06:39.529+05:30	2022-06-26 12:06:39.529+05:30
1760e29d-5402-42ff-81d1-250d8ed6058e	Groccary	This is groccary categories	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225438372.png	f	2022-06-26 12:07:22.466+05:30	2022-06-26 12:07:22.466+05:30
2932d3d5-fc0e-41cb-aad5-ffcab071b046	Baby Care	This is baby care categories	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225520380.png	f	2022-06-26 12:08:44.559+05:30	2022-06-26 12:08:44.559+05:30
b3c7e11b-86b7-49b0-93ad-6efb858ff458	Foods	This is food categories	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225607916.png	f	2022-06-26 12:10:11.228+05:30	2022-06-26 12:10:11.228+05:30
a1526391-c24f-46ca-ac2b-70af20037cdc	Health Care	Home Medicines ,Health Supplements ,Women's Safety ,Professional medical supplies ,Health Care Combo ,Home Medical Supplies	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225679148.png	f	2022-06-26 12:11:24.407+05:30	2022-06-26 12:11:24.407+05:30
42c425bb-5eda-4202-a564-d0ae835277b0	Toys	Soft Toys ,Puzzles and Cubes ,Hobby Kits ,Baby Toys ,Dolls & Doll Houses ,Sports Toys ,Learning and Educational Toys ,Toy Vehicles ,Role Play Toys ,Musical Toys	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225740063.png	f	2022-06-26 12:12:24.037+05:30	2022-06-26 12:12:24.037+05:30
674a0b42-3e02-43d0-ba98-7be4f0f6a779	Sport and Fittness	Sports & Fitness Equipment	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225790511.png	f	2022-06-26 12:13:13.95+05:30	2022-06-26 12:13:13.95+05:30
5f3b3624-16e9-4b2a-898f-83b9f55d39ef	Books	Books are a treasure trove of knowledge. It is essential to inculcate reading habits from an early age to develop vocabulary and imaginative skills.	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225847403.png	f	2022-06-26 12:14:10.758+05:30	2022-06-26 12:14:10.758+05:30
02b8b1e8-0aeb-4643-ad3f-fb987debd316	Stationary and School Accessories	School Accessories Online including Erasers,Pencils,Sharpeners,Chalks & Chalk Boxes, Rulers and much more at Flipkart.com.	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656225939362.png	f	2022-06-26 12:15:43.687+05:30	2022-06-26 12:15:43.687+05:30
35f52699-e911-4b0d-92bb-d84faf0f8333	Safety Products	Safety Products ,Industrial Measurement Devices ,Lab & Scientific Products ,Additive Manufacturing Products ,Packaging & Shipping Products ,Industrial Testing Devices	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656226011740.png	f	2022-06-26 12:16:55.9+05:30	2022-06-26 12:16:55.9+05:30
5e155c3a-1aae-496a-ac8e-074eb446c300	Home	Bean Bags ,Shelves ,Zuari Furniture ,Plastic Furniture ,Drawers ,RoyalOak Furniture ,Stands ,Wakefit Furniture ,Chairs ,Sofas	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/img_1656226099618.png	f	2022-06-26 12:18:23.83+05:30	2022-06-26 12:18:23.83+05:30
\.


--
-- Data for Name: Complaints; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Complaints" (id, title, "complaintMsg", is_archieved, "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FeedBacks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."FeedBacks" (id, "feedbackDesc", rating, "orderProductId", is_archieved, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: OrderProductMappings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."OrderProductMappings" (id, "orderId", "productId", "trackingStatus", quantity, "sellerId", price, is_returned, is_archieved, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Orders" (id, "userId", "addressId", "paymentId", "paymentType", is_archieved, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ProductOffers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ProductOffers" (id, name, description, "offerType", "maxAllowed", "userId", "productId", "startDate", "endDate", "isArchived", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Products" (id, "productName", description, "productImage", price, quantity, commission, is_archieved, status, "brandId", "sellerId", "subCategoryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20220614083046-create-category.js
20220614083625-create-users.js
20220614105354-create-brand.js
20220615042740-create-sub-category.js
20220616065235-create-user-otp.js
20220617083417-create-products.js
20220617120101-create-addresses.js
20220618063013-create-oders.js
20220619171754-create-complaints.js
20220620083109-create-order-product-mappings.js
20220620083333-create-carts.js
20220620135209-create-feed-backs.js
20220621053826-changeColumn.js
20220622092626-create-product-offer.js
\.


--
-- Data for Name: SubCategories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SubCategories" (id, "subCategoryName", description, "categoryId", is_archieved, "createdAt", "updatedAt") FROM stdin;
3e3e39c6-b1eb-42e1-b242-bafc23ef2d57	Baby Dipher	Baby Dipher	2932d3d5-fc0e-41cb-aad5-ffcab071b046	f	2022-06-26 12:22:24.294+05:30	2022-06-26 12:22:24.294+05:30
e4cbf0e1-82ee-4a6e-95db-985379eae2d0	Baby Gift Sets & Combo	This is Baby Gift Sets & Combo sub categories.	2932d3d5-fc0e-41cb-aad5-ffcab071b046	f	2022-06-26 12:23:08.623+05:30	2022-06-26 12:23:08.623+05:30
2ffad7bd-38ad-4c25-a374-ecd3fcd6563f	Baby Bathing Accessories	This is Baby Bathing Accessories sub categories.	2932d3d5-fc0e-41cb-aad5-ffcab071b046	f	2022-06-26 12:23:33.773+05:30	2022-06-26 12:23:33.773+05:30
4f953135-73d2-471b-9c94-7b1334a6c090	History and Archaeology Books	This is History and Archaeology Books sub categories.	5f3b3624-16e9-4b2a-898f-83b9f55d39ef	f	2022-06-26 12:24:37.814+05:30	2022-06-26 12:24:37.814+05:30
46601a29-f34a-48c5-9815-b4e4b10ef514	Social Science Books	This is Social Science Books sub categories.	5f3b3624-16e9-4b2a-898f-83b9f55d39ef	f	2022-06-26 12:24:54.602+05:30	2022-06-26 12:24:54.602+05:30
cb31a871-e1c9-4959-af7b-a3ac5f572431	School Books	This is School Books sub categories.	5f3b3624-16e9-4b2a-898f-83b9f55d39ef	f	2022-06-26 12:25:08.534+05:30	2022-06-26 12:25:08.534+05:30
bfc64e3b-dc6d-486a-afe7-09b28a391586	Literature Books\n	This is Literature Books\n sub categories.	5f3b3624-16e9-4b2a-898f-83b9f55d39ef	f	2022-06-26 12:25:24.51+05:30	2022-06-26 12:25:24.51+05:30
f0a2def5-179a-4368-8b04-8124c18b590c	Laptop	This is Laptop sub categories.	85251883-c6e7-4f69-8902-27075831590a	f	2022-06-26 12:27:03.317+05:30	2022-06-26 12:27:03.317+05:30
866c48ce-ec34-4da1-acab-04b55b7b2430	Smart Phones	This is Smart Phones sub categories.	85251883-c6e7-4f69-8902-27075831590a	f	2022-06-26 12:27:18.609+05:30	2022-06-26 12:27:18.609+05:30
158234d7-cf75-46d1-aa75-6370b390bfc1	TV	This is TV sub categories.	85251883-c6e7-4f69-8902-27075831590a	f	2022-06-26 12:27:31.337+05:30	2022-06-26 12:27:31.337+05:30
b12050a7-0ac8-4481-b821-99c7994e5d34	Headphones	This is Headphones sub categories.	85251883-c6e7-4f69-8902-27075831590a	f	2022-06-26 12:27:49+05:30	2022-06-26 12:27:49+05:30
d3c0bea8-5902-4722-9085-6d3e03f8ef9b	Shirt	This is Shirt sub categories.	35ae6767-8c68-4e3d-8cac-b881b6a78f74	f	2022-06-26 12:28:23.41+05:30	2022-06-26 12:28:23.41+05:30
304ff700-15c3-42c0-8a96-18590e122755	T-shirt	This is T-shirt sub categories.	35ae6767-8c68-4e3d-8cac-b881b6a78f74	f	2022-06-26 12:28:33.278+05:30	2022-06-26 12:28:33.278+05:30
0f1f9a59-c713-4375-85ca-8e51d0c124fa	Paints	This is Paints sub categories.	35ae6767-8c68-4e3d-8cac-b881b6a78f74	f	2022-06-26 12:28:44.794+05:30	2022-06-26 12:28:44.794+05:30
27a7b5e4-b3d9-40fb-93bf-c92c7f8ddfa8	Milky	This is milky sub categories.	b3c7e11b-86b7-49b0-93ad-6efb858ff458	f	2022-06-26 12:29:23.574+05:30	2022-06-26 12:29:23.574+05:30
aa9a41eb-f818-4d52-abfd-db7b4a0aeabd	Soft drinks	This is Soft drinks sub categories.	b3c7e11b-86b7-49b0-93ad-6efb858ff458	f	2022-06-26 12:29:46.412+05:30	2022-06-26 12:29:46.412+05:30
f0e4fcb5-4c89-41e5-8667-a1d7f859f50a	Fruit Squash	This is Fruit Squash sub categories.	b3c7e11b-86b7-49b0-93ad-6efb858ff458	f	2022-06-26 12:30:01.241+05:30	2022-06-26 12:30:01.241+05:30
9dfe8905-0245-4715-a349-92a41d577b3c	Home Medical Supplies\n	This is Home Medical Supplies sub categories.	a1526391-c24f-46ca-ac2b-70af20037cdc	f	2022-06-26 12:31:41.298+05:30	2022-06-26 12:31:41.298+05:30
e444ded7-11ce-484f-b4bb-43a5e8a4e80b	Women's Safety	This is Women's Safety sub categories.	a1526391-c24f-46ca-ac2b-70af20037cdc	f	2022-06-26 12:32:05.888+05:30	2022-06-26 12:32:05.888+05:30
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, "firstName", "lastName", email, password, "contactNo", avatar, role, "GSTNo", "verifyToken", "isVerified", "isArchived", "createdAt", "updatedAt") FROM stdin;
eda4307b-827e-468e-b02c-9003bede21ff	Admin	1	admin1@gmail.com	$2b$10$WSJcPzH.OtTU6n6QdXzRw.MYhB1D2aaPQ9ywOQ3BLaCYq2wizY4Wi	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	ADMIN			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
50516359-c071-464b-885b-a47a13e95e96	Admin	2	admin2@gmail.com	$2b$10$WSJcPzH.OtTU6n6QdXzRw.MYhB1D2aaPQ9ywOQ3BLaCYq2wizY4Wi	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	ADMIN			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
61c449eb-cbd7-42cc-90c6-c11405644714	Admin	3	admin3@gmail.com	$2b$10$WSJcPzH.OtTU6n6QdXzRw.MYhB1D2aaPQ9ywOQ3BLaCYq2wizY4Wi	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	ADMIN			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
6dcb41a1-9a76-4ad3-aa4c-4847644b5ccc	Admin	4	admin4@gmail.com	$2b$10$WSJcPzH.OtTU6n6QdXzRw.MYhB1D2aaPQ9ywOQ3BLaCYq2wizY4Wi	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	ADMIN			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
ce621522-4175-44d8-8fbd-5479787568a7	Krushit	Dudhat	krushit.dudhat@bacancy.com	$2b$10$CTp7mN6DoMkIJw1clLMG5eChpUqE1QS38nxKKElWz2qoiTD0WHC/u	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	SELLER	18AABCU9603R1ZM		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
a7fb28b5-cdb2-44ef-a7e2-ab337e54e2f3	Seller	1	seller1@gmail.com	$2b$10$u6FjLXNB/ymSbc1ylG4D7.7Z6pkbRjgPofCsnwoQhDnsDqgrKqbfS	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	SELLER	37AADCS0472N1Z1		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
9c273a4c-6b33-4626-99c8-45ddf7676d1b	Seller	2	seller2@gmail.com	$2b$10$u6FjLXNB/ymSbc1ylG4D7.7Z6pkbRjgPofCsnwoQhDnsDqgrKqbfS	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	SELLER	37AADCS0472N2Z0		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
6b772b43-c398-4acc-b897-fe8e77c31224	Seller	3	seller3@gmail.com	$2b$10$u6FjLXNB/ymSbc1ylG4D7.7Z6pkbRjgPofCsnwoQhDnsDqgrKqbfS	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	SELLER	26AADCS0472N1Z4		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
41c91cd0-8a19-4693-ab06-7e75d08e19f3	Seller	4	seller4@gmail.com	$2b$10$u6FjLXNB/ymSbc1ylG4D7.7Z6pkbRjgPofCsnwoQhDnsDqgrKqbfS	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	SELLER	36AAICS1406R1ZY		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
1851ac2b-c8db-44b2-bfb2-fecc9605438a	Seller	5	seller5@gmail.com	$2b$10$u6FjLXNB/ymSbc1ylG4D7.7Z6pkbRjgPofCsnwoQhDnsDqgrKqbfS	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	SELLER	36AAICS1406R1ZY		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
281fe9ed-ed40-4626-861b-763db1f3a9de	Seller	6	seller6@gmail.com	$2b$10$u6FjLXNB/ymSbc1ylG4D7.7Z6pkbRjgPofCsnwoQhDnsDqgrKqbfS	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	SELLER	36AAICS1406R1ZY		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
b33a8e85-7e70-481d-9b09-ad2cb8e97066	Seller	7	seller7@gmail.com	$2b$10$u6FjLXNB/ymSbc1ylG4D7.7Z6pkbRjgPofCsnwoQhDnsDqgrKqbfS	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	SELLER	36AAICS1406R1ZY		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
555ed505-d9c6-4e77-82ad-d43585b94bc9	Seller	8	seller8@gmail.com	$2b$10$u6FjLXNB/ymSbc1ylG4D7.7Z6pkbRjgPofCsnwoQhDnsDqgrKqbfS	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	SELLER	36AAICS1406R1ZY		t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
56f2cccb-784e-4439-9f22-1b7fdb65a3d5	Vinayak	Chavan	vinayak.chavan@bacancy.com	$2b$10$2vMeBXmKtgTHiF/AmwUWRuj.EOAcnJlzmE0g37ni5IsFb1rr8b5wC	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
fefd6e64-e0a6-4349-baef-ec067a443798	User	2	user2@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
48cf148c-84a9-410c-aacd-3f2b4e9bce75	User	3	user3@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
598077d0-1f61-4c85-993d-e91f9d057cdd	User	4	user4@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
becfb722-0fe4-4662-8d5a-c0d2e8463ca2	Apexa	Patel	apexa.patel@bacancy.com	$2b$10$LxFh64v3zL.P8B5UUR4hX.T7r/e/uqBGKqBrcW6MAHpeblH3WO6wq	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER		eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImJlY2ZiNzIyLTBmZTQtNDY2Mi04ZDVhLWMwZDJlODQ2M2NhMiIsImVtYWlsIjoiYXBleGEucGF0ZWxAYmFjYW5jeS5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTY1NjE2MTY3MCwiZXhwIjoxNjU2MjQ4MDcwfQ.1oYW16KZRHX6RsY7GaI8HbbIvQweo2yJ-nOt8UrmPu0	t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:24:30.778+05:30
f3168370-aadc-4558-976a-8bd2c4b8a49e	Admin 1	Admin 1	user1@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/f3168370-aadc-4558-976a-8bd2c4b8a49e.jpeg	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 19:03:04.99+05:30
ed1d34c3-002e-44ea-8f4d-a7701b66123c	Manish	Rathod	manish.rathod@bacancy.com	$2b$10$wixVnnw1RpfdGsruWgNJ/Oz8eM9vQQaFtUKZDsDyDzAWkMLUMEDA6	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	ADMIN		eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImVkMWQzNGMzLTAwMmUtNDRlYS04ZjRkLWE3NzAxYjY2MTIzYyIsImVtYWlsIjoibWFuaXNoLnJhdGhvZEBiYWNhbmN5LmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTY1NjIyNDk2NiwiZXhwIjoxNjU2MzExMzY2fQ.UEok9uAO3Qo2gVqS9JeN8QxrdNVCByW4YpCV1ACoPYc	t	f	2022-06-25 18:07:19.432+05:30	2022-06-26 11:59:26.141+05:30
717ec4d0-0e64-45fc-8442-9a6768351dc0	User	5	user5@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
92a8f848-37ed-4325-b36d-8c7adc627814	User	6	user6@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
50a9748b-0305-4ed8-a8f3-36093d1058cf	User	7	user7@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
96590954-e2b0-4940-8be0-81558fd1290f	User	8	user8@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
47f56d08-93d8-4a87-9dfe-24be36f11bb5	User	9	user9@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
1e60ecdf-dcda-4230-91b6-3acb7d01338a	User	10	user10@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
3c9cffb3-7327-4865-8def-9f09472d6651	User	11	user11@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
5d340a58-fb17-4d6f-aeb1-acc80b59bdce	User	12	user12@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
0a8abfa9-2aa0-46c6-83b9-16076ad0720d	User	13	user13@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
035f48fb-ad27-4475-ae9a-cb1e105cf08e	User	14	user14@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
a36f8fb3-10a7-41c4-a7e4-478f899607d1	User	15	user15@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
739a9dfc-4b51-4e53-8b53-87a1373ef3ab	User	16	user16@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
8c18ed8f-396d-4581-a9c3-5e8315b52a97	User	17	user17@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
e2971eee-5def-4897-987c-c3465d42bb9f	User	18	user18@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
5833c3f2-f287-4c2b-a34a-da9827ff0a30	User	19	user19@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/56f2cccb-784e-4439-9f22-1b7fdb65a3d5	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
fce71bcd-4956-4d4c-9b33-7b301a42aef0	User	20	user20@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/becfb722-0fe4-4662-8d5a-c0d2e8463ca2	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
a72ac676-faa9-4efb-bb6c-c97b6f65e645	User	21	user21@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
c7bb69a2-5c0c-4079-b1a4-ef899fb147d3	User	22	user22@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
72df8fd9-11ce-4ebb-892c-ddf254be1edf	User	23	user23@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
6ccdb28d-1c71-419e-a3d9-ec8879478e60	User	24	user24@gmail.com	$2b$10$PSMKcOofJitstHwTm5odreM.Z0PKeh9VgTny6CAFTvBtmfTVIhjMW	1234567890	https://e-commerce-bacancy.s3.ap-south-1.amazonaws.com/ce621522-4175-44d8-8fbd-5479787568a7	USER			t	f	2022-06-25 18:07:19.432+05:30	2022-06-25 18:07:19.432+05:30
\.


--
-- Data for Name: UsersOTPs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UsersOTPs" (id, "userId", otp, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: Addresses Addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Addresses"
    ADD CONSTRAINT "Addresses_pkey" PRIMARY KEY (id);


--
-- Name: Brands Brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Brands"
    ADD CONSTRAINT "Brands_pkey" PRIMARY KEY (id);


--
-- Name: Carts Carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_pkey" PRIMARY KEY (id);


--
-- Name: Categories Categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY (id);


--
-- Name: Complaints Complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_pkey" PRIMARY KEY (id);


--
-- Name: FeedBacks FeedBacks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."FeedBacks"
    ADD CONSTRAINT "FeedBacks_pkey" PRIMARY KEY (id);


--
-- Name: OrderProductMappings OrderProductMappings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderProductMappings"
    ADD CONSTRAINT "OrderProductMappings_pkey" PRIMARY KEY (id);


--
-- Name: Orders Orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_pkey" PRIMARY KEY (id);


--
-- Name: ProductOffers ProductOffers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductOffers"
    ADD CONSTRAINT "ProductOffers_pkey" PRIMARY KEY (id);


--
-- Name: Products Products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: SubCategories SubCategories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SubCategories"
    ADD CONSTRAINT "SubCategories_pkey" PRIMARY KEY (id);


--
-- Name: UsersOTPs UsersOTPs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UsersOTPs"
    ADD CONSTRAINT "UsersOTPs_pkey" PRIMARY KEY (id);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Addresses Addresses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Addresses"
    ADD CONSTRAINT "Addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- Name: Carts Carts_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id);


--
-- Name: Carts Carts_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Carts"
    ADD CONSTRAINT "Carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- Name: Complaints Complaints_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Complaints"
    ADD CONSTRAINT "Complaints_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- Name: OrderProductMappings OrderProductMappings_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderProductMappings"
    ADD CONSTRAINT "OrderProductMappings_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public."Orders"(id);


--
-- Name: OrderProductMappings OrderProductMappings_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderProductMappings"
    ADD CONSTRAINT "OrderProductMappings_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id);


--
-- Name: OrderProductMappings OrderProductMappings_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."OrderProductMappings"
    ADD CONSTRAINT "OrderProductMappings_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."Users"(id);


--
-- Name: Orders Orders_addressId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES public."Addresses"(id);


--
-- Name: Orders Orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Orders"
    ADD CONSTRAINT "Orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- Name: ProductOffers ProductOffers_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductOffers"
    ADD CONSTRAINT "ProductOffers_productId_fkey" FOREIGN KEY ("productId") REFERENCES public."Products"(id);


--
-- Name: ProductOffers ProductOffers_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ProductOffers"
    ADD CONSTRAINT "ProductOffers_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- Name: Products Products_brandId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES public."Brands"(id);


--
-- Name: Products Products_sellerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES public."Users"(id);


--
-- Name: Products Products_subCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Products"
    ADD CONSTRAINT "Products_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES public."SubCategories"(id);


--
-- Name: SubCategories SubCategories_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SubCategories"
    ADD CONSTRAINT "SubCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Categories"(id);


--
-- Name: UsersOTPs UsersOTPs_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UsersOTPs"
    ADD CONSTRAINT "UsersOTPs_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."Users"(id);


--
-- PostgreSQL database dump complete
--

