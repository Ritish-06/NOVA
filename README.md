# NOVA
⚡ NOVA — Find Power. Anywhere.

What if finding an EV charger felt less like searching a map and more like exploring the world?

NOVA is an immersive 3D global EV charging discovery platform built around a simple idea:

Wherever you go, you should know where you can charge.

Instead of opening a traditional map filled with charging pins, NOVA lets users start with an interactive 3D globe, explore locations, discover charging stations, inspect chargers, plan journeys, and understand their charging options through a smooth visual experience.

The goal isn’t just to find a charger.

It’s to make the journey to finding one feel effortless.

⸻

🌍 Start With the World

Open NOVA and the world is right in front of you.

🌍 WORLD
   ↓
📍 LOCATION
   ↓
🏙️ CITY
   ↓
⚡ CHARGING STATIONS
   ↓
🔌 CHARGER
   ↓
🔋 CHARGE
   ↓
🛣️ JOURNEY

Move around the globe.

Explore a location.

Find nearby charging stations.

Choose a charger.

Plan the next part of your journey.

Everything is connected.

⸻

✨ What Can You Do With NOVA?

🌍 Explore the World

Interact with a 3D globe and discover charging infrastructure across different locations.

⚡ Find a Charger

Search by:

* Location
* Distance
* Charging speed
* Connector
* Availability
* Network
* Pricing

🗺️ Explore Stations

Switch from the 3D world to an interactive map and explore charging stations around you.

🔌 Understand the Charger

Before heading there, see:

* Charger type
* Connector
* Charging speed
* Availability
* Pricing
* Operator
* Amenities

🚗 Tell NOVA About Your EV

Add your vehicle and provide details such as:

* Battery capacity
* Range
* Connector type

This allows NOVA to make charging calculations more relevant to your vehicle.

🔋 Estimate Your Charge

Wondering how long your next charge might take?

Enter your:

Current battery → Target battery → Battery capacity → Charging speed

NOVA estimates:

* Energy required
* Charging time
* Approximate cost

Charging times are estimates and can vary depending on the vehicle, charger, battery temperature, and charging conditions.

🛣️ Plan Your Journey

Planning a long EV trip?

NOVA helps visualize:

START
  ↓
DRIVE
  ↓
⚡ CHARGE
  ↓
DRIVE
  ↓
⚡ CHARGE
  ↓
DESTINATION

The idea is simple:

Don’t just plan where you’re going. Plan where you’ll charge along the way.

🎬 Experience Charging in 3D

This is where NOVA becomes different.

Instead of presenting charging as another piece of information, the platform uses 3D visualization to show the relationship between:

Grid → Charger → Vehicle → Battery

Energy flows through the experience while the interface responds to the user’s actions.

⸻

🎨 Built to Be Experienced

NOVA isn’t designed as a collection of static pages.

The interface is built around movement.

Scroll down and the experience changes.

The camera moves.

The globe responds.

Charging points appear.

Locations become stations.

Stations become chargers.

Chargers become the starting point for a journey.

The goal is to make the user think:

“I want to see what happens next.”

⸻

🧠 The Idea Behind the Design

Most charging platforms start with:

“Here is a map.”

NOVA starts with:

“Where are you going?”

That small difference changes the entire experience.

The interface stays intentionally simple while the 3D environment, animation, maps, and interactions do the storytelling.

⸻

🛠️ Technology Behind NOVA

NOVA combines modern web technologies to create the experience.

Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui
* Three.js
* React Three Fiber
* Drei
* GSAP
* ScrollTrigger
* Zustand
* React Hook Form
* Zod

Backend

* Node.js
* NestJS
* TypeScript
* PostgreSQL
* Prisma
* Redis
* JWT
* Swagger / OpenAPI

⸻

🏗️ How It Works

                         🌍 NOVA
                            │
             ┌──────────────┴──────────────┐
             │                             │
        🎨 FRONTEND                    ⚙️ BACKEND
             │                             │
       Next.js + React                 NestJS
             │                             │
       Three.js / WebGL                 REST API
             │                             │
        GSAP / Motion                 PostgreSQL
             │                         Prisma
          Zustand                       Redis
             │                             │
             └──────────────┬──────────────┘
                            │
                    ⚡ Charging Data
                       Providers

⸻

🚀 Getting Started

1. Clone the repository

git clone https://github.com/YOUR-USERNAME/nova.git
cd nova

2. Start the frontend

cd frontend
npm install
npm run dev

Open:

http://localhost:3000

3. Start the backend

cd backend
npm install

Create a .env file:

DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
REDIS_URL=
CORS_ORIGIN=
PORT=4000

Run the database:

npx prisma migrate dev
npx prisma db seed

Start the API:

npm run start:dev

⸻

📡 Core API

NOVA is structured around a clean REST API.

GET    /api/v1/stations
GET    /api/v1/stations/:id
GET    /api/v1/stations/nearby
GET    /api/v1/networks
GET    /api/v1/vehicles
POST   /api/v1/vehicles
POST   /api/v1/calculator/charge
POST   /api/v1/trips
GET    /api/v1/trips
GET    /api/v1/favorites
POST   /api/v1/favorites/:stationId

⸻

⚡ Smooth by Design

3D looks impressive.

But if it feels slow, the experience is ruined.

That’s why NOVA treats performance as part of the design.

The project focuses on:

* Optimized 3D assets
* Lazy loading
* Dynamic imports
* Optimized textures
* Reduced particles
* Device-based quality
* Mobile-friendly 3D
* WebGL fallback
* Reduced-motion support
* Smooth requestAnimationFrame interactions

Goal

Make the experience feel as smooth as it looks.

⸻

🌐 Data & Real-World Charging

NOVA is designed to work with real EV charging data providers.

The platform separates:

LIVE DATA

Real-time information from supported providers.

STATIC DATA

Station and charger information that doesn’t change frequently.

DEMO DATA

Development/testing data used while building the product.

Demo information should never be presented as real-time availability.

⸻

🔮 What’s Next?

NOVA is still evolving.

Planned possibilities include:

* Real-time charger availability
* Live charging sessions
* EV charging network integrations
* Navigation integration
* Online payments
* AI-powered charging recommendations
* Smarter route optimization
* EV range prediction
* Community station reviews
* Native mobile application

⸻

📌 Project Status

🚧 In Development

NOVA is being built as a full-stack exploration of:

3D Web + EV Technology + Maps + Motion Design + UX + Full-Stack Development

The goal is to create something that isn’t just functional, but genuinely enjoyable to explore.

⸻

👨‍💻 About

RITISH S

Computer Science Engineering
UI/UX Designer • Frontend Developer

NOVA is a project built to explore how technology, interaction, and visual storytelling can come together to solve a real-world problem.

⸻

⚡ NOVA

Find Power. Anywhere.

Explore the world. Find your charger. Keep moving.
