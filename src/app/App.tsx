import { useState, useEffect, useRef } from "react";
import {
  ChevronRight,
  Cpu,
  Zap,
  Navigation,
  Eye,
  Gamepad2,
  Settings,
  GitBranch,
  Terminal,
  ExternalLink,
  Menu,
  X,
  Radio,
  Layers,
  RotateCcw,
  Target,
  Crosshair,
  Activity,
} from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const NAV = [
  { id: "overview", label: "Overview", icon: Layers },
  { id: "setup", label: "Getting Started", icon: Terminal },
  { id: "drivetrain", label: "DriveTrain", icon: Navigation, group: "Hardware" },
  { id: "shooter", label: "Shooter", icon: Zap, group: "Hardware" },
  { id: "turret", label: "Turret", icon: Crosshair, group: "Hardware" },
  { id: "intake", label: "Intake", icon: RotateCcw, group: "Hardware" },
  { id: "controls", label: "Controls", icon: Gamepad2, group: "Controls" },
  { id: "autonomous", label: "Autonomous", icon: GitBranch, group: "Autonomous" },
  { id: "turtle", label: "Turtle Paths", icon: Activity, group: "Autonomous" },
  { id: "vision", label: "Vision System", icon: Eye, group: "Vision" },
  { id: "aprilTags", label: "April Tags", icon: Target, group: "Vision" },
  { id: "constants", label: "Constants & Tuning", icon: Settings },
  { id: "architecture", label: "Architecture", icon: Cpu },
];

// ─── UI Primitives ───────────────────────────────────────────────────────────

function Badge({ children, color = "cyan" }: { children: React.ReactNode; color?: "cyan" | "amber" | "green" | "red" | "purple" }) {
  const colors = {
    cyan: "bg-teal-500/10 text-teal-400 border-teal-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-mono border rounded ${colors[color]}`}>
      {children}
    </span>
  );
}

function Code({ children, block = false }: { children: React.ReactNode; block?: boolean }) {
  if (block) {
    return (
      <pre className="bg-[#040810] border border-[rgba(94,175,196,0.12)] rounded-md p-4 text-sm font-mono text-teal-300 overflow-x-auto leading-relaxed">
        {children}
      </pre>
    );
  }
  return (
    <code className="font-mono text-teal-300 bg-teal-500/8 px-1.5 py-0.5 rounded text-sm border border-teal-500/15">
      {children}
    </code>
  );
}

function SectionTitle({ label, id }: { label: string; id: string }) {
  return (
    <div className="mb-6" id={id}>
      <div className="flex items-center gap-2 mb-1">
        <span className="font-mono text-xs text-teal-500/60 tracking-widest uppercase">§</span>
        <span className="font-mono text-xs text-teal-500/60 tracking-widest uppercase">{id}</span>
      </div>
      <h2 className="text-2xl font-bold text-slate-100" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
        {label}
      </h2>
      <div className="mt-3 h-px bg-gradient-to-r from-teal-600/25 via-teal-600/8 to-transparent" />
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "1.1rem" }}>
        <span className="w-1 h-4 bg-teal-500 rounded-full inline-block" />
        {title}
      </h3>
      {children}
    </div>
  );
}

function InfoCard({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "warn" | "tip" }) {
  const styles = {
    default: "border-[rgba(34,211,238,0.15)] bg-[rgba(34,211,238,0.04)]",
    warn: "border-amber-500/20 bg-amber-500/5",
    tip: "border-green-500/20 bg-green-500/5",
  };
  const labels = { default: "NOTE", warn: "WARNING", tip: "TIP" };
  const labelColors = { default: "text-teal-400", warn: "text-amber-400", tip: "text-green-400" };
  return (
    <div className={`border rounded-md p-4 mb-4 ${styles[variant]}`}>
      <div className={`font-mono text-xs font-bold mb-2 tracking-widest ${labelColors[variant]}`}>{labels[variant]}</div>
      <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto mb-6">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-[rgba(34,211,238,0.15)]">
            {headers.map((h, i) => (
              <th key={i} className="text-left py-2 px-3 font-mono text-xs text-teal-500/70 uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-[rgba(255,255,255,0.04)] hover:bg-white/[0.02] transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="py-2.5 px-3 text-slate-300 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="border border-[rgba(94,175,196,0.12)] bg-[#0d1520] rounded-md p-4">
      <div className="font-mono text-xs text-teal-500/60 uppercase tracking-widest mb-1">{label}</div>
      <div className="text-xl font-bold text-teal-300 font-mono">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

// ─── Section Content ─────────────────────────────────────────────────────────

function SectionOverview() {
  return (
    <section>
      <SectionTitle label="Overview" id="overview" />
      <p className="text-slate-300 leading-relaxed mb-6">
        <strong className="text-slate-100">Chicago State Invitationals</strong> is the competition robot codebase for an FTC (FIRST Tech Challenge)
        team. Built in Java on the FTC SDK 11.1, it controls a mecanum-drive robot equipped with a precision
        shooter, servo-driven turret with AprilTag vision tracking, and a path-following autonomous system powered
        by Pedro Pathing.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="SDK Version" value="11.1.0" sub="FTC Robot SDK" />
        <StatCard label="Drive" value="Mecanum" sub="4-motor omni" />
        <StatCard label="Auto Library" value="Pedro" sub="v2.1.2" />
        <StatCard label="Vision" value="HuskyLens" sub="AprilTag" />
      </div>

      <SubSection title="Robot Capabilities">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Navigation, label: "Mecanum Drive", desc: "Voltage-compensated 4-wheel holonomic drivetrain with encoder odometry." },
            { icon: Zap, label: "Dual-Motor Shooter", desc: "RPM-controlled flywheel with physics-based kinematics for distance calculations." },
            { icon: Crosshair, label: "Vision Turret", desc: "Servo-mounted turret with AprilTag PID tracking and angle inference." },
            { icon: GitBranch, label: "Autonomous Paths", desc: "JSON-compiled Turtle path programs executed via Pedro Pathing library." },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="border border-[rgba(34,211,238,0.1)] bg-[#0d1520] rounded-md p-4 flex gap-3">
              <Icon size={18} className="text-teal-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-200 mb-1" style={{ fontFamily: "'Rajdhani', sans-serif" }}>{label}</div>
                <div className="text-xs text-slate-400 leading-relaxed">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Repository Layout">
        <Code block>{`TeamCode/src/main/java/org/firstinspires/ftc/teamcode/
├── autonomous/
│   ├── blue/BluePrism.java        ← Blue alliance auto OpMode
│   └── pedroPathing/Constants.java
├── teleop/
│   ├── TeleopMain.java            ← Main driver-controlled OpMode
│   └── TeleopTest.java
├── systemsControls/
│   ├── DriveTrain.java
│   ├── Shooter.java
│   ├── Turret.java
│   ├── Intake.java
│   └── visionSystem/
│       ├── VisionSystem.java
│       ├── AprilTags.java
│       └── AprilTagDetection.java
├── controls/
│   ├── Controller.java
│   ├── DefaultProfile.java
│   └── Inputs.java
├── Paths/
│   ├── TurtleRunner.java
│   ├── TurtleCompiler.java
│   └── AutoConfiguration.java
└── utils/
    ├── RobotConstants.java
    ├── KinematicsForShooter.java
    └── TelemetryMenu.java`}</Code>
      </SubSection>
    </section>
  );
}

function SectionSetup() {
  return (
    <section>
      <SectionTitle label="Getting Started" id="setup" />
      <p className="text-slate-300 leading-relaxed mb-6">
        This project is a standard FTC SDK Android project. Follow these steps to clone, build, and deploy code to your Control Hub or Phone.
      </p>

      <SubSection title="Prerequisites">
        <Table
          headers={["Requirement", "Details"]}
          rows={[
            ["Android Studio", "Ladybug (2024.2.1) or newer recommended"],
            ["JDK", "17+ (bundled with Android Studio)"],
            ["FTC SDK", "v11.1.0 — already included as dependency"],
            ["ADB / USB Drivers", "Required for wired deployment to Control Hub"],
            ["Wi-Fi Direct", "Alternative — connect phone/laptop to robot Wi-Fi"],
          ]}
        />
      </SubSection>

      <SubSection title="Clone & Open">
        <Code block>{`# Clone the repository
git clone https://github.com/VardinsDev/ChicagoStateInvitationals.git
cd ChicagoStateInvitationals

# Open in Android Studio:
# File → Open → select the cloned folder`}</Code>
        <InfoCard variant="tip">
          Let Gradle sync fully before building. This downloads Pedro Pathing and the Bylazar libraries (~first run may take 2–3 minutes).
        </InfoCard>
      </SubSection>

      <SubSection title="Build & Deploy">
        <div className="space-y-3">
          {[
            { step: "01", label: "Connect robot", desc: "USB-A to USB-C from laptop to Control Hub, or join the robot's Wi-Fi Direct network." },
            { step: "02", label: "Select run config", desc: "Android Studio toolbar → ensure 'TeamCode' module is selected as the run configuration." },
            { step: "03", label: "Run / Deploy", desc: "Click ▶ Run (Shift+F10). Gradle builds the APK and installs it onto the Control Hub automatically." },
            { step: "04", label: "Select OpMode", desc: "On the Driver Station app, use the dropdown to pick TeleopMain or BluePrism autonomous." },
          ].map(({ step, label, desc }) => (
            <div key={step} className="flex gap-4 items-start">
              <span className="font-mono text-xs text-teal-500/50 mt-1 shrink-0 w-6">{step}</span>
              <div>
                <span className="text-sm font-semibold text-slate-200">{label} — </span>
                <span className="text-sm text-slate-400">{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Wireless Deployment (ADB over Wi-Fi)">
        <Code block>{`# On the Control Hub: Settings → Wi-Fi → note the IP address
# On laptop (one-time setup):
adb connect <CONTROL_HUB_IP>:5555

# Verify connection:
adb devices
# Should list: <IP>:5555   device

# Then deploy normally via Android Studio ▶`}</Code>
        <InfoCard variant="warn">
          ADB over Wi-Fi can disconnect during Gradle sync. Keep a USB cable nearby as backup.
        </InfoCard>
      </SubSection>

      <SubSection title="Key Dependencies (build.dependencies.gradle)">
        <Table
          headers={["Library", "Version", "Purpose"]}
          rows={[
            [<Code>pedro-pathing</Code>, "2.1.2", "Autonomous path following"],
            [<Code>bylazar:fullpanels</Code>, "1.0.12", "Driver telemetry UI"],
            [<Code>ftc-sdk:RobotCore</Code>, "11.1.0", "Core FTC SDK"],
          ]}
        />
      </SubSection>
    </section>
  );
}

function SectionDrivetrain() {
  return (
    <section>
      <SectionTitle label="DriveTrain" id="drivetrain" />
      <p className="text-slate-300 leading-relaxed mb-6">
        Four-motor mecanum drivetrain with voltage compensation. Located at{" "}
        <Code>systemsControls/DriveTrain.java</Code>.
      </p>

      <SubSection title="Motor Configuration">
        <Table
          headers={["Position", "Hardware Name", "Direction"]}
          rows={[
            ["Front Left", <Code>fl</Code>, "Reversed"],
            ["Front Right", <Code>fr</Code>, "Forward"],
            ["Back Left", <Code>bl</Code>, "Reversed"],
            ["Back Right", <Code>br</Code>, "Forward"],
          ]}
        />
        <InfoCard>
          Motor names (<Code>fl</Code>, <Code>fr</Code>, <Code>bl</Code>, <Code>br</Code>) must match the names configured in the Robot Configuration on the Driver Station.
        </InfoCard>
      </SubSection>

      <SubSection title="Voltage Compensation">
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          The drivetrain reads the Control Hub's voltage sensor each loop and scales motor power so the robot
          behaves consistently regardless of battery charge level.
        </p>
        <Code block>{`// DriveTrain.java — voltage compensation formula
double voltageCompFactor = NOMINAL_VOLTAGE / currentVoltage;
// NOMINAL_VOLTAGE = 12.0V
// Applied: motorPower *= voltageCompFactor (clamped to maxPower)`}</Code>
      </SubSection>

      <SubSection title="Mecanum Kinematics">
        <Code block>{`// drive(x, y, rotation) — all values in [-1, 1]
// x     = strafe (positive = right)
// y     = forward/back (positive = forward)
// rotation = turn (positive = counter-clockwise)

frontLeft  = y + x + rotation;
frontRight = y - x - rotation;
backLeft   = y - x + rotation;
backRight  = y + x - rotation;`}</Code>
      </SubSection>

      <SubSection title="Telemetry Fields">
        <Table
          headers={["Field", "Description"]}
          rows={[
            ["Motor Powers", "FL / FR / BL / BR power values each loop"],
            ["Current Draw", "Per-motor amp readings (DcMotorEx)"],
            ["Voltage Factor", "Compensation multiplier applied this loop"],
          ]}
        />
      </SubSection>
    </section>
  );
}

function SectionShooter() {
  return (
    <section>
      <SectionTitle label="Shooter" id="shooter" />
      <p className="text-slate-300 leading-relaxed mb-6">
        Dual-motor flywheel shooter with state-machine control and distance-based RPM kinematics. Located at{" "}
        <Code>systemsControls/Shooter.java</Code>.
      </p>

      <SubSection title="State Machine">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {["IDLE", "SPINNING_UP", "READY"].map((s, i) => (
            <>
              <Badge key={s} color={s === "READY" ? "green" : s === "SPINNING_UP" ? "amber" : "cyan"}>
                {s}
              </Badge>
              {i < 2 && <ChevronRight size={14} className="text-slate-600" />}
            </>
          ))}
        </div>
        <Table
          headers={["State", "Condition", "Action"]}
          rows={[
            [<Badge color="cyan">IDLE</Badge>, "Default / spinDown() called", "Motors off"],
            [<Badge color="amber">SPINNING_UP</Badge>, "spinUp(rpm) called", "Ramping to target RPM"],
            [<Badge color="green">READY</Badge>, "Within ±100 RPM of target", "Ready to fire"],
          ]}
        />
      </SubSection>

      <SubSection title="RPM Velocity Conversion">
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          The motors use GoBilda 5202-0002-0019 (19.2:1 gearboxes). The SDK reports ticks-per-second based
          on the geared output. The shooter bypasses this to control the bare motor directly.
        </p>
        <Code block>{`// Bypass the 19.2:1 gearbox from SDK's velocity reporting
// Encoder CPR (at bare motor): 28 ticks/rev
// Geared CPR reported by SDK: 537.7 ticks/rev

// Convert target RPM → degrees per second (DPS):
DPS = (targetRPM * 168) / 537.7;

// Then pass to setVelocity(DPS, AngleUnit.DEGREES)
// This tells the SDK the DPS at the *geared* shaft,
// but because we've scaled by the gear ratio, the
// motor actually spins at targetRPM.`}</Code>
        <InfoCard variant="warn">
          Max safe RPM is <Code>6000</Code>. Exceeding this will cause the SDK velocity controller to saturate and the motors will run open-loop.
        </InfoCard>
      </SubSection>

      <SubSection title="Distance-Based Kinematics">
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          <Code>KinematicsForShooter.java</Code> provides two methods to get the target RPM given a distance:
        </p>
        <Table
          headers={["Distance", "Target RPM (lookup)"] }
          rows={[
            ["0.5 m", "2200 RPM"],
            ["1.0 m", "2600 RPM"],
            ["1.5 m", "3000 RPM"],
            ["2.0 m", "3400 RPM"],
            ["2.5 m", "3800 RPM"],
            ["3.0 m", "4300 RPM"],
          ]}
        />
        <p className="text-sm text-slate-400">
          For distances outside this range, a projectile physics fallback is used: it solves for the launch
          velocity needed to reach the goal given the launch angle, horizontal distance, and vertical offset.
        </p>
      </SubSection>

      <SubSection title="API">
        <Table
          headers={["Method", "Description"]}
          rows={[
            [<Code>spinUp(int rpm)</Code>, "Transition to SPINNING_UP, set target RPM"],
            [<Code>spinDown()</Code>, "Stop motors, return to IDLE"],
            [<Code>fire()</Code>, "Fire mechanism (implementation pending)"],
            [<Code>isReady()</Code>, "Returns true when state == READY"],
            [<Code>setMotorSpeed(float rpm)</Code>, "Low-level: directly set velocity"],
          ]}
        />
      </SubSection>
    </section>
  );
}

function SectionTurret() {
  return (
    <section>
      <SectionTitle label="Turret" id="turret" />
      <p className="text-slate-300 leading-relaxed mb-6">
        Servo-mounted turret with a 4-state vision tracking system using the HuskyLens camera and AprilTags.
        Located at <Code>systemsControls/Turret.java</Code>.
      </p>

      <SubSection title="State Machine">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {["IDLE", "SEARCHING", "ACQUIRING", "LOCKED"].map((s, i) => (
            <>
              <Badge key={s} color={s === "LOCKED" ? "green" : s === "ACQUIRING" ? "amber" : s === "SEARCHING" ? "purple" : "cyan"}>
                {s}
              </Badge>
              {i < 3 && <ChevronRight size={14} className="text-slate-600" />}
            </>
          ))}
        </div>
        <Table
          headers={["State", "Behavior"]}
          rows={[
            [<Badge color="cyan">IDLE</Badge>, "Servo holds position, no vision polling"],
            [<Badge color="purple">SEARCHING</Badge>, "Uses robot odometry position + target field pose to mathematically infer the angle and pre-point the servo"],
            [<Badge color="amber">ACQUIRING</Badge>, "Performs a visual sweep (±4° steps, up to 5 steps each side) to locate the AprilTag in camera FOV"],
            [<Badge color="green">LOCKED</Badge>, "PID loop centers the tag horizontally; servo adjusts every 50ms"],
          ]}
        />
      </SubSection>

      <SubSection title="Servo Configuration">
        <Table
          headers={["Parameter", "Value"]}
          rows={[
            ["Servo Range", "-90° to +90° from robot centerline"],
            ["Camera Center X", "160 px (320px-wide frame)"],
            ["Vision Poll Rate", "20 ms"],
            ["Servo Lock Delay", "50 ms"],
            ["PID Kp", "Defined in RobotConstants (needs tuning, currently 0)"],
            ["PID Kd", "Defined in RobotConstants (needs tuning, currently 0)"],
          ]}
        />
        <InfoCard variant="warn">
          The PID gains are set to <Code>0</Code> and require tuning before the LOCKED state will actively track. Start by increasing Kp in small increments (0.001–0.005) until the turret converges without oscillation.
        </InfoCard>
      </SubSection>

      <SubSection title="Tuning the Turret">
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex gap-3">
            <span className="font-mono text-teal-500/60 shrink-0">1.</span>
            <span>Set a breakpoint or telemetry output on the <Code>errorX</Code> value in the LOCKED state loop.</span>
          </div>
          <div className="flex gap-3">
            <span className="font-mono text-teal-500/60 shrink-0">2.</span>
            <span>Increase <Code>RobotConstants.TURRET_KP</Code> until the turret moves toward center.</span>
          </div>
          <div className="flex gap-3">
            <span className="font-mono text-teal-500/60 shrink-0">3.</span>
            <span>If it oscillates, add <Code>RobotConstants.TURRET_KD</Code> to dampen.</span>
          </div>
          <div className="flex gap-3">
            <span className="font-mono text-teal-500/60 shrink-0">4.</span>
            <span>Verify the servo arm doesn't physically over-travel beyond ±90°.</span>
          </div>
        </div>
      </SubSection>
    </section>
  );
}

function SectionIntake() {
  return (
    <section>
      <SectionTitle label="Intake" id="intake" />
      <InfoCard variant="warn">
        The <Code>Intake.java</Code> subsystem is currently a placeholder. The class exists and is wired into
        the controller input pipeline, but no motors or servos have been configured yet.
      </InfoCard>
      <p className="text-slate-300 leading-relaxed mb-6">
        The intake is controlled via Driver 1's D-pad (delta adjustments) and Driver 2's triangle button (toggle).
        Once hardware is defined, add motor configuration in the constructor and implement the power-setting logic
        in the update loop.
      </p>
      <SubSection title="Planned Interface (from Controls)">
        <Table
          headers={["Input", "Action"]}
          rows={[
            [<Code>IntakeInput.delta</Code>, "Incremental power adjustment (D-pad up/down)"],
            [<Code>IntakeInput.active</Code>, "Toggle intake on/off (Driver 2 triangle)"],
            [<Code>IntakeInput.direction</Code>, "Intake vs. eject direction"],
          ]}
        />
      </SubSection>
    </section>
  );
}

function SectionControls() {
  return (
    <section>
      <SectionTitle label="Controls" id="controls" />
      <p className="text-slate-300 leading-relaxed mb-6">
        The control system uses an abstraction layer to decouple gamepad bindings from subsystem logic.
        <Code>Controller.java</Code> polls both gamepads and produces typed input snapshots.
      </p>

      <SubSection title="Default Gamepad Layout">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
          <div>
            <div className="text-xs font-mono text-teal-500/60 uppercase tracking-widest mb-2">Driver 1 — Movement</div>
            <Table
              headers={["Input", "Action"]}
              rows={[
                ["Right Stick X/Y", "Strafe & Forward"],
                ["Left Stick X", "Rotation"],
                ["Right Stick Button", "Toggle Slow Mode"],
                ["D-Pad Up/Down", "Intake power delta"],
              ]}
            />
          </div>
          <div>
            <div className="text-xs font-mono text-teal-500/60 uppercase tracking-widest mb-2">Driver 2 — Systems</div>
            <Table
              headers={["Input", "Action"]}
              rows={[
                ["D-Pad Up/Down", "Shooter RPM large step"],
                ["D-Pad Left/Right", "Shooter RPM small step"],
                ["Triangle (PS) / Y (Xbox)", "Toggle Intake"],
                ["—", "Fire (pending)"],
              ]}
            />
          </div>
        </div>
      </SubSection>

      <SubSection title="Controller Architecture">
        <Code block>{`// Controller.java — core input loop
ControllerSnapshot snap = controller.poll();

// snap contains typed objects:
snap.movement    // MovementInput: x, y, rotation
snap.shooter     // ShooterInput: delta, active, fire
snap.intake      // IntakeInput: delta, active, direction
snap.slowMode    // boolean

// The controller reuses these objects every loop
// to avoid generating GC pressure on the FTC runtime`}</Code>
        <InfoCard variant="tip">
          To create a custom control scheme, implement the <Code>ControlProfile</Code> interface and pass it
          to <Code>new Controller(hardwareMap, gamepad1, gamepad2, yourProfile)</Code>.
        </InfoCard>
      </SubSection>

      <SubSection title="Slow Mode">
        <p className="text-sm text-slate-300 leading-relaxed">
          Toggled by pressing the right stick button on Driver 1. When active, all movement inputs are scaled
          down (typically 0.3–0.4×). Useful for precise positioning during endgame or when lining up a shot.
          The scaling factor is set in <Code>ControlConfig</Code>.
        </p>
      </SubSection>
    </section>
  );
}

function SectionAutonomous() {
  return (
    <section>
      <SectionTitle label="Autonomous" id="autonomous" />
      <p className="text-slate-300 leading-relaxed mb-6">
        Autonomous modes use Pedro Pathing (v2.1.2) for smooth, constraint-based path following.
        The <Code>BluePrism.java</Code> OpMode is the primary autonomous program for the blue alliance.
      </p>

      <SubSection title="BluePrism OpMode">
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Before the match starts, the driver configures three parameters via a telemetry menu on the
          Driver Station:
        </p>
        <Table
          headers={["Parameter", "Options", "Effect"]}
          rows={[
            ["Target Row", "1, 2, 3", "Which scoring row the robot aims for"],
            ["Battery State", "CHARGED, UNCHARGED", "Adjusts path timing/power for battery voltage"],
            ["Direction", "FORWARD, BACKWARD", "Approach direction to the scoring zone"],
          ]}
        />
        <Code block>{`// BluePrism.java — startup sequence
1. TelemetryMenu shown to driver → driver selects config
2. waitForStart() — robot waits for match to begin
3. TurtleRunner loads "Paths/bluePrism.turt" from assets
4. Path is compiled: JSON → PathChain (via TurtleCompiler)
5. PedroPathing follower executes the PathChain
6. Configuration values injected as path parameters`}</Code>
      </SubSection>

      <SubSection title="Pedro Pathing Configuration">
        <p className="text-sm text-slate-300 leading-relaxed mb-3">
          Tuning values live in <Code>pedroPathing/Constants.java</Code>:
        </p>
        <Table
          headers={["Constant", "Value", "Description"]}
          rows={[
            [<Code>MAX_POWER</Code>, "0.99", "Max motor power during path following"],
            [<Code>MAX_VELOCITY</Code>, "100", "Max velocity (inches/sec)"],
            [<Code>MAX_ACCEL</Code>, "1", "Max acceleration multiplier"],
            [<Code>ODOMETRY</Code>, "Pinpoint", "GoBilda 4-bar encoder pods"],
          ]}
        />
        <InfoCard variant="tip">
          Run Pedro Pathing's built-in tuning OpModes (<Code>Tuning.java</Code>) before any autonomous testing.
          Odometry accuracy directly determines path quality.
        </InfoCard>
      </SubSection>

      <SubSection title="Odometry Setup (Pinpoint)">
        <Code block>{`// Constants.java — Pinpoint odometry
FORWARD_ENCODER_DIRECTION = Encoder.FORWARD;
STRAFE_ENCODER_DIRECTION  = Encoder.FORWARD;

// Pod offsets (tune to physical robot measurements):
FORWARD_OFFSET = 0;   // inches forward from robot center
STRAFE_OFFSET  = 0;   // inches left from robot center

// GoBilda 4-bar encoder resolution: 2000 ticks/rev
// Wheel diameter: 35mm (GoBilda odometry pods)`}</Code>
      </SubSection>
    </section>
  );
}

function SectionTurtle() {
  return (
    <section>
      <SectionTitle label="Turtle Path System" id="turtle" />
      <p className="text-slate-300 leading-relaxed mb-6">
        The Turtle system is a custom intermediate format for autonomous paths. Paths are stored as
        JSON <Code>.turt</Code> files in the Android assets folder and compiled at runtime into
        Pedro Pathing <Code>PathChain</Code> objects.
      </p>

      <SubSection title="File Format">
        <Code block>{`// Paths/bluePrism.turt (conceptual structure)
{
  "start": { "x": 0, "y": 0, "heading": 0 },
  "sequence": [
    {
      "type": "bezier",        // or "line"
      "end": { "x": 24, "y": 0 },
      "controlPoints": [
        { "x": 12, "y": 6 }
      ],
      "endTangent": 0
    },
    {
      "type": "line",
      "end": { "x": 24, "y": 24 }
    }
  ]
}`}</Code>
      </SubSection>

      <SubSection title="TurtleRunner Usage">
        <Code block>{`// Inside your autonomous OpMode:
TurtleRunner runner = new TurtleRunner(hardwareMap, follower);

// Load and execute a path from assets:
runner.loadPath("Paths/bluePrism.turt");
runner.setConfig(autoConfig);   // AutoConfiguration object
runner.run();                   // Blocks until path complete`}</Code>
      </SubSection>

      <SubSection title="AutoConfiguration">
        <Code block>{`// AutoConfiguration.java
public class AutoConfiguration {
    public BatteryState batteryState;  // CHARGED | UNCHARGED
    public Direction direction;        // FORWARD | BACKWARD
    public int targetRow;              // 1, 2, or 3
}

// These values are passed into path parameter
// slots at compile time, allowing one path file
// to handle multiple match configurations.`}</Code>
      </SubSection>

      <SubSection title="Creating New Paths">
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">1.</span><span>Create a <Code>.turt</Code> JSON file in <Code>TeamCode/src/main/assets/Paths/</Code></span></div>
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">2.</span><span>Define a start point and a sequence of bezier curves or line segments.</span></div>
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">3.</span><span>Use <Code>TurtleCompiler.compile(file)</Code> to test compilation in a test OpMode.</span></div>
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">4.</span><span>Use Pedro Pathing's path visualizer (web tool) to preview the curves before running on hardware.</span></div>
        </div>
      </SubSection>
    </section>
  );
}

function SectionVision() {
  return (
    <section>
      <SectionTitle label="Vision System" id="vision" />
      <p className="text-slate-300 leading-relaxed mb-6">
        Vision is handled by the HuskyLens camera running the ALGORITHM_APRIL_TAG mode.
        <Code>VisionSystem.java</Code> wraps the HuskyLens SDK with rate-limiting and object pooling.
      </p>

      <SubSection title="Initialization">
        <Code block>{`// VisionSystem.java constructor
VisionSystem vision = new VisionSystem(hardwareMap);
// Hardware map name: "huskylens" (configure in Robot Config)

// Verify camera is alive:
boolean ok = vision.ping();

// Set polling rate (default 20ms):
vision.setPollPeriodMs(20);`}</Code>
      </SubSection>

      <SubSection title="Reading Detections">
        <Code block>{`// Get all currently visible AprilTags:
List<AprilTagDetection> all = vision.getAllDetections();

// Get a specific tag by enum:
AprilTagDetection blueGoal = vision.getDetection(AprilTags.BLUE_GOAL);
if (blueGoal != null) {
    int   tagId   = blueGoal.getId();
    float centerX = blueGoal.getCenterX();   // pixels
    float centerY = blueGoal.getCenterY();
    float width   = blueGoal.getWidth();     // bounding box
}

// Object pool: max 10 detections tracked simultaneously`}</Code>
      </SubSection>

      <SubSection title="Performance Notes">
        <Table
          headers={["Detail", "Value"]}
          rows={[
            ["Max tracked detections", "10 (pooled, no GC pressure)"],
            ["Default poll rate", "20 ms"],
            ["Camera resolution", "320 × 240 px"],
            ["Algorithm", "ALGORITHM_APRIL_TAG"],
          ]}
        />
        <InfoCard>
          Vision polling is rate-limited in software. Calling <Code>getAllDetections()</Code> faster than the poll
          period returns the last cached result, not a new camera frame.
        </InfoCard>
      </SubSection>
    </section>
  );
}

function SectionAprilTags() {
  return (
    <section>
      <SectionTitle label="April Tags" id="aprilTags" />
      <p className="text-slate-300 leading-relaxed mb-6">
        The <Code>AprilTags.java</Code> enum maps physical tag IDs to their field coordinates.
        All positions are in inches, origin at the red alliance wall corner.
      </p>

      <SubSection title="Tag Registry">
        <Table
          headers={["Enum Constant", "Tag ID", "Field X (in)", "Field Y (in)", "Alliance"]}
          rows={[
            [<Badge color="cyan">BLUE_GOAL</Badge>, "20", "14.877", "171.954", "Blue"],
            [<Badge color="cyan">BLUE_PRISM</Badge>, "10", "0", "0", "Blue"],
            [<Badge color="red">RED_GOAL</Badge>, "24", "175", "172", "Red"],
            [<Badge color="red">RED_PRISM</Badge>, "14", "0", "0", "Red"],
          ]}
        />
        <InfoCard variant="warn">
          BLUE_PRISM and RED_PRISM field positions are currently <Code>(0, 0)</Code> — placeholders that need
          to be measured on the physical field and updated before competition.
        </InfoCard>
      </SubSection>

      <SubSection title="Turret Angle Inference">
        <Code block>{`// SEARCHING state — how the turret pre-points before seeing the tag
// Uses robot odometry position + target tag field position:

double dx = target.fieldX - robot.x;
double dy = target.fieldY - robot.y;
double angleToTarget = Math.atan2(dy, dx);   // radians

// Converted to servo position and applied immediately
// so the tag is likely in frame when ACQUIRING begins`}</Code>
      </SubSection>

      <SubSection title="Adding New Tags">
        <Code block>{`// AprilTags.java
public enum AprilTags {
    BLUE_GOAL(20, 14.877, 171.954),
    BLUE_PRISM(10, 0, 0),    // ← update with real coords
    RED_GOAL(24, 175, 172),
    RED_PRISM(14, 0, 0),     // ← update with real coords
    MY_NEW_TAG(99, 72.0, 96.0);   // ← add new tag here

    public final int id;
    public final double fieldX, fieldY;
    // ...
}`}</Code>
      </SubSection>
    </section>
  );
}

function SectionConstants() {
  return (
    <section>
      <SectionTitle label="Constants & Tuning" id="constants" />
      <p className="text-slate-300 leading-relaxed mb-6">
        Robot-wide tuning constants live in <Code>utils/RobotConstants.java</Code>.
        The <Code>@Configurable</Code> annotation (from Bylazar) allows some values to be changed
        live from the Driver Station without redeploying code.
      </p>

      <SubSection title="Turret Constants">
        <Table
          headers={["Constant", "Default", "Description"]}
          rows={[
            [<Code>TURRET_KP</Code>, "0", "Proportional gain for centering PID"],
            [<Code>TURRET_KD</Code>, "0", "Derivative gain for damping"],
            [<Code>TURRET_SWEEP_STEP</Code>, "4°", "Degrees per sweep step in ACQUIRING"],
            [<Code>TURRET_SWEEP_MAX</Code>, "5 steps", "Max sweep steps before giving up"],
          ]}
        />
      </SubSection>

      <SubSection title="Shooter Constants">
        <Table
          headers={["Constant", "Default", "Description"]}
          rows={[
            [<Code>SHOOTER_MAX_RPM</Code>, "6000", "Hardware ceiling — do not exceed"],
            [<Code>SHOOTER_RPM_TOL</Code>, "100", "Tolerance band to enter READY state"],
            [<Code>NOMINAL_VOLTAGE</Code>, "12.0V", "Reference voltage for compensation"],
          ]}
        />
      </SubSection>

      <SubSection title="Live Tuning with @Configurable">
        <Code block>{`// Any field annotated @Configurable appears in
// the Bylazar "fullpanels" Driver Station UI:

@Configurable
public static double TURRET_KP = 0;

// To use:
// 1. Deploy code to robot
// 2. Open "FtcDashboard" or the fullpanels overlay
//    on the Driver Station
// 3. Adjust values in real time during a test run
// 4. Copy final values back into RobotConstants.java`}</Code>
        <InfoCard variant="tip">
          Always copy tuned values back to the source file after a session. Live-configured values reset on reboot.
        </InfoCard>
      </SubSection>
    </section>
  );
}

function SectionArchitecture() {
  return (
    <section>
      <SectionTitle label="Architecture" id="architecture" />
      <p className="text-slate-300 leading-relaxed mb-6">
        The codebase follows a layered architecture: OpModes orchestrate, subsystems encapsulate hardware,
        and utilities provide shared logic.
      </p>

      <SubSection title="Dependency Graph">
        <Code block>{`OpModes (TeleopMain, BluePrism)
    │
    ├── Controller ──────────────── ControlProfile (interface)
    │       └── Inputs              DefaultProfile (impl)
    │
    ├── DriveTrain ────────────── 4x DcMotorEx + VoltageSensor
    ├── Shooter ───────────────── 2x DcMotorEx
    │       └── KinematicsForShooter
    ├── Turret ────────────────── ServoImplEx + VisionSystem
    │       └── VisionSystem ──── HuskyLens → AprilTags enum
    └── Intake ────────────────── (pending)

BluePrism (Auto)
    └── TurtleRunner
            └── TurtleCompiler → PedroPathing PathChain
                    └── Constants.java (follower config)`}</Code>
      </SubSection>

      <SubSection title="Design Patterns Used">
        <Table
          headers={["Pattern", "Where", "Why"]}
          rows={[
            ["State Machine", "Shooter, Turret", "Safe, predictable hardware transitions"],
            ["Object Pooling", "Controller, VisionSystem", "Avoid GC pauses on FTC's Dalvik VM"],
            ["Abstraction (Interface)", "ControlProfile", "Swap control layouts without touching OpModes"],
            ["Data Transfer Object", "ControllerSnapshot, Inputs.*", "Typed, immutable input bundles per loop"],
            ["Asset-based config", "TurtleRunner (.turt files)", "Paths editable without recompiling Java"],
          ]}
        />
      </SubSection>

      <SubSection title="Adding a New Subsystem">
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">1.</span><span>Create <Code>systemsControls/MySubsystem.java</Code>. Constructor takes <Code>HardwareMap</Code>.</span></div>
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">2.</span><span>Add an <Code>update()</Code> method that reads state, applies control, and writes to hardware.</span></div>
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">3.</span><span>Add a typed <Code>MyInput</Code> class to <Code>controls/Inputs.java</Code>.</span></div>
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">4.</span><span>Wire the input into <Code>DefaultProfile</Code> and <Code>ControllerSnapshot</Code>.</span></div>
          <div className="flex gap-3"><span className="font-mono text-teal-500/60 shrink-0">5.</span><span>Instantiate and call <Code>update()</Code> in the relevant OpMode loop.</span></div>
        </div>
      </SubSection>
    </section>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

function Sidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: string;
  onSelect: (id: string) => void;
  open: boolean;
  onClose: () => void;
}) {
  const groups: Record<string, typeof NAV> = {};
  const ungrouped: typeof NAV = [];
  NAV.forEach((item) => {
    if (item.group) {
      groups[item.group] = groups[item.group] || [];
      groups[item.group].push(item);
    } else {
      ungrouped.push(item);
    }
  });

  const renderItem = (item: (typeof NAV)[0]) => {
    const Icon = item.icon;
    const isActive = active === item.id;
    return (
      <button
        key={item.id}
        onClick={() => { onSelect(item.id); onClose(); }}
        className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-sm rounded transition-all text-left
          ${isActive
            ? "bg-teal-500/12 text-teal-300 border-l-2 border-teal-400"
            : "text-slate-500 hover:text-slate-300 hover:bg-white/4 border-l-2 border-transparent"
          }`}
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <Icon size={13} className={isActive ? "text-teal-400" : "text-slate-600"} />
        <span>{item.label}</span>
      </button>
    );
  };

  const content = (
    <nav className="flex flex-col gap-1 p-4 pt-6">
      <div className="mb-4 px-3">
        <div className="flex items-center gap-2 mb-1">
          <Radio size={14} className="text-teal-400" />
          <span className="font-bold text-slate-100 text-sm tracking-wide" style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.08em" }}>
            CSI ROBOTICS
          </span>
        </div>
        <span className="font-mono text-xs text-teal-500/50">v2024–2025</span>
      </div>

      <div className="h-px bg-gradient-to-r from-cyan-500/20 to-transparent mb-3" />

      {ungrouped.map(renderItem)}

      {Object.entries(groups).map(([group, items]) => (
        <div key={group} className="mt-4">
          <div className="px-3 mb-1 font-mono text-[10px] text-slate-600 uppercase tracking-widest">
            {group}
          </div>
          {items.map(renderItem)}
        </div>
      ))}

      <div className="mt-6 px-3">
        <a
          href="https://github.com/VardinsDev/ChicagoStateInvitationals"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-slate-600 hover:text-teal-400 transition-colors"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <ExternalLink size={11} />
          GitHub Repository
        </a>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-[rgba(34,211,238,0.08)] bg-[#060a0f] h-full overflow-y-auto sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        style={{ background: "rgba(7,11,16,0.8)", backdropFilter: "blur(4px)" }}
      >
        <aside
          className="absolute left-0 top-0 bottom-0 w-64 border-r border-[rgba(94,175,196,0.12)] bg-[#060a0f] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-300"
          >
            <X size={16} />
          </button>
          {content}
        </aside>
      </div>
    </>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

const SECTION_MAP: Record<string, React.FC> = {
  overview: SectionOverview,
  setup: SectionSetup,
  drivetrain: SectionDrivetrain,
  shooter: SectionShooter,
  turret: SectionTurret,
  intake: SectionIntake,
  controls: SectionControls,
  autonomous: SectionAutonomous,
  turtle: SectionTurtle,
  vision: SectionVision,
  aprilTags: SectionAprilTags,
  constants: SectionConstants,
  architecture: SectionArchitecture,
};

export default function App() {
  const [active, setActive] = useState("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const ActiveSection = SECTION_MAP[active] ?? SectionOverview;

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [active]);

  return (
    <div
      className="flex h-screen bg-background text-foreground overflow-hidden"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <Sidebar active={active} onSelect={setActive} open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-[rgba(34,211,238,0.08)] bg-[#060a0f] shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-slate-500 hover:text-slate-300 mr-1"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="flex items-center gap-2">
              <Cpu size={14} className="text-teal-400" />
              <span className="font-mono text-xs text-slate-400">
                Chicago State Invitationals — FTC Docs
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge color="green">FTC SDK 11.1</Badge>
            <a
              href="https://github.com/VardinsDev/ChicagoStateInvitationals"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-teal-400 transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* Content */}
        <main ref={contentRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-10">
            <ActiveSection />

            {/* Prev / Next */}
            <div className="flex justify-between mt-12 pt-6 border-t border-[rgba(34,211,238,0.08)]">
              {(() => {
                const idx = NAV.findIndex((n) => n.id === active);
                const prev = NAV[idx - 1];
                const next = NAV[idx + 1];
                return (
                  <>
                    {prev ? (
                      <button
                        onClick={() => setActive(prev.id)}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-400 transition-colors"
                      >
                        <ChevronRight size={14} className="rotate-180" />
                        <span>{prev.label}</span>
                      </button>
                    ) : <span />}
                    {next ? (
                      <button
                        onClick={() => setActive(next.id)}
                        className="flex items-center gap-2 text-sm text-slate-500 hover:text-teal-400 transition-colors"
                      >
                        <span>{next.label}</span>
                        <ChevronRight size={14} />
                      </button>
                    ) : <span />}
                  </>
                );
              })()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
