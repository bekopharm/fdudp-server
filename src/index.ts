import dgram from "node:dgram";
import { FlyDangerousTelemetry } from "./FlyDangerous";
import { Status } from "./EliteDangerous";

const server = dgram.createSocket("udp4");
const FDUDP = 11000;

server.on("error", (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on("message", (data, rinfo) => {
  // console.log(`server got: ${data} from ${rinfo.address}:${rinfo.port}`)
  const b = Buffer.from(data);
  let obj: any = {};
  try {
    const buffer_str = b.toString("utf-8");
    obj = JSON.parse(buffer_str);
  } catch (error) {
    console.log("Could not parse JSON from message ", b.toString("utf-8"));
  }

  if (Object.keys(obj).length) {
    const result = convertFDtoED(obj);
    console.dir(result);
  }
});

server.on("listening", () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

/**
 * Converts Fly Dangerous telemetry to an Elite Dangerous Status JSON (as
 * good as possible) so existing 3rd party apps may show something useful.
 *
 * This is designed to be adapted into a Node-RED function so it returns
 * a message with a payload.
 *
 * @important Not everything can be mapped in a useful way
 *
 * @see https://elite-journal.readthedocs.io/en/latest/Status%20File/
 *
 * @param msg FlyDangerousTelemetry
 * @returns Status
 */
const convertFDtoED = (msg: FlyDangerousTelemetry) => {
  if (msg.flyDangerousTelemetryId !== 1) {
    // not fd telemetry
    return { msg: { payload: {} } };
  }

  let flags = 0;
  if (msg.boostChargeReady) flags += 8; // shields ready
  if (msg.isBoostThrustActive) flags += 16; //super cruise
  if (!msg.vectorFlightAssistActive && !msg.rotationalFlightAssistActive)
    flags += 32;
  if (msg.velocityLimiterActive) flags += 512; // Cargo Scoop Deployed
  if (msg.underWater) flags += 1024; // silent running
  if (msg.isBoostSpooling) flags += 65536; //mass locked
  if (msg.isBoostSpooling) flags += 131072; //fsd charging
  if (msg.isBoostThrustActive) flags += 262144; //fsd cooldown
  if (msg.proximityWarning) flags += 4194304; // IsInDanger
  if (msg.lightsActive) flags += 268435456; // night visionaq

  const status: Status = {
    timestamp: new Date().getTime(),
    event: "Status",
    Flags: flags,
    Cargo: 0,
    // TODO: that's absolute numbers, can we convert this to lat/long in a sane way?
    Latitude: 0, //msg.shipWorldPosition.x
    Longitude: 0, //msg.shipWorldPosition.z,
    GuiFocus: 0,
    Heading: msg.shipWorldRotationEuler.y,
    Altitude:
      msg.shipAltitude < 2000 ? msg.shipHeightFromGround : msg.shipAltitude,
    Speed: msg.shipSpeed,
    BodyName: msg.currentLevelName,
    // assuming earthlike - no real data
    PlanetRadius: 6371,
  };

  return { msg: { payload: status } };
};

server.bind(FDUDP);
