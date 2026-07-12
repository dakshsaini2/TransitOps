// Mock in-memory vehicle service.
// Keeps the app functional without a real backend.

const VEHICLES = [
  {
    id: "veh_1",
    registration: "MH-12-AB-1234",
    make: "Tata",
    model: "Nexon",
    driver: "R. Sharma",
    route: "Pune → Mumbai",
    status: "En route",
    statusCode: "en_route",
    uptimePct: 94,
  },
  {
    id: "veh_2",
    registration: "MH-04-CD-5678",
    make: "Ashok Leyland",
    model: "Ecomet",
    driver: "A. Patel",
    route: "Depot idle",
    status: "Idle",
    statusCode: "idle",
    uptimePct: 76,
  },
  {
    id: "veh_3",
    registration: "MH-12-EF-9012",
    make: "Mahindra",
    model: "Bolero",
    driver: "S. Kulkarni",
    route: "Mumbai → Nashik",
    status: "En route",
    statusCode: "en_route",
    uptimePct: 91,
  },
];

const STATUS = [
  { code: "en_route", label: "En route" },
  { code: "idle", label: "Idle" },
  { code: "maintenance", label: "Maintenance" },
  { code: "offline", label: "Offline" },
];

export function getStatusOptions() {
  return STATUS;
}

export function listVehicles() {
  return Promise.resolve([...VEHICLES]);
}

export function getVehicleById(id) {
  const v = VEHICLES.find((x) => x.id === id);
  if (!v) return Promise.reject(new Error("Vehicle not found"));
  return Promise.resolve({ ...v });
}

export function addVehicle(payload) {
  const id = `veh_${Date.now()}`;
  const newVehicle = { id, ...payload };
  VEHICLES.unshift(newVehicle);
  return Promise.resolve({ ...newVehicle });
}

export function updateVehicle(id, payload) {
  const idx = VEHICLES.findIndex((x) => x.id === id);
  if (idx === -1) return Promise.reject(new Error("Vehicle not found"));
  VEHICLES[idx] = { ...VEHICLES[idx], ...payload };
  return Promise.resolve({ ...VEHICLES[idx] });
}

export function deleteVehicle(id) {
  const idx = VEHICLES.findIndex((x) => x.id === id);
  if (idx === -1) return Promise.reject(new Error("Vehicle not found"));
  VEHICLES.splice(idx, 1);
  return Promise.resolve(true);
}

