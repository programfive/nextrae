import "@/style/auth.css";

function AuthIcon({ ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.2" />
          <stop
            offset="100%"
            stopColor="hsl(var(--muted-foreground))"
            stopOpacity="0.1"
          />
        </linearGradient>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop
            offset="100%"
            stopColor="hsl(var(--primary))"
            stopOpacity="0.8"
          />
        </linearGradient>
        <linearGradient id="screenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--background))" />
          <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Estilos de animación */}
      <style>
        {`
  .float-animation {
    animation: float 3s ease-in-out infinite;
  }
  .float-delayed {
    animation: float 3s ease-in-out infinite;
    animation-delay: 1s;
  }
  .float-delayed-2 {
    animation: float 3s ease-in-out infinite;
    animation-delay: 2s;
  }
  .pulse-animation {
    animation: pulse 2s ease-in-out infinite;
  }
  .grow-bar {
    animation: growBar 2s ease-out;
    transform-origin: bottom;
  }
  .draw-line {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: drawLine 3s ease-in-out infinite;
  }
  .rotate-slow {
    animation: rotateSlow 20s linear infinite;
    transform-origin: center;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.05); }
  }
  @keyframes growBar {
    0% { transform: scaleY(0); }
    100% { transform: scaleY(1); }
  }
  @keyframes drawLine {
    0% { stroke-dashoffset: 100; }
    50% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -100; }
  }
  @keyframes rotateSlow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`}
      </style>

      <circle
        cx="200"
        cy="150"
        r="140"
        fill="url(#bgGradient)"
        className="rotate-slow"
        style={{ opacity: "var(--circle-opacity)" }}
      />

      <rect
        x="120"
        y="100"
        width="160"
        height="100"
        rx="8"
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />
      <rect
        x="130"
        y="110"
        width="140"
        height="80"
        rx="4"
        fill="hsl(var(--background))"
      />

      <rect
        x="135"
        y="115"
        width="130"
        height="70"
        rx="2"
        fill="url(#screenGradient)"
      />

      <rect
        x="145"
        y="160"
        width="12"
        height="15"
        fill="url(#chartGradient)"
        className="grow-bar"
        style={{ animationDelay: "0.1s" }}
      />
      <rect
        x="162"
        y="150"
        width="12"
        height="25"
        fill="url(#chartGradient)"
        className="grow-bar"
        style={{ animationDelay: "0.2s" }}
      />
      <rect
        x="179"
        y="140"
        width="12"
        height="35"
        fill="url(#chartGradient)"
        className="grow-bar"
        style={{ animationDelay: "0.3s" }}
      />
      <rect
        x="196"
        y="135"
        width="12"
        height="40"
        fill="url(#chartGradient)"
        className="grow-bar"
        style={{ animationDelay: "0.4s" }}
      />
      <rect
        x="213"
        y="145"
        width="12"
        height="30"
        fill="url(#chartGradient)"
        className="grow-bar"
        style={{ animationDelay: "0.5s" }}
      />
      <rect
        x="230"
        y="155"
        width="12"
        height="20"
        fill="url(#chartGradient)"
        className="grow-bar"
        style={{ animationDelay: "0.6s" }}
      />

      <path
        d="M145 165 L162 155 L179 145 L196 140 L213 150 L230 160"
        stroke="hsl(var(--destructive))"
        strokeWidth="2"
        fill="none"
        className="draw-line"
      />

      <g className="float-animation">
        <circle
          cx="80"
          cy="80"
          r="20"
          fill="hsl(var(--primary))"
          className="pulse-animation"
        />
        <text
          x="80"
          y="88"
          textAnchor="middle"
          fill="hsl(var(--primary-foreground))"
          fontSize="16"
          fontWeight="bold"
        >
          $
        </text>
      </g>

      <g className="float-delayed">
        <circle
          cx="320"
          cy="70"
          r="18"
          fill="hsl(var(--secondary))"
          className="pulse-animation"
        />
        <text
          x="320"
          y="77"
          textAnchor="middle"
          fill="hsl(var(--secondary-foreground))"
          fontSize="14"
          fontWeight="bold"
        >
          €
        </text>
      </g>

      <g className="float-delayed-2">
        <circle
          cx="90"
          cy="220"
          r="16"
          fill="hsl(var(--accent))"
          className="pulse-animation"
        />
        <text
          x="90"
          y="227"
          textAnchor="middle"
          fill="hsl(var(--accent-foreground))"
          fontSize="12"
          fontWeight="bold"
        >
          Bs
        </text>
      </g>

      <g className="float-animation">
        <rect
          x="300"
          y="180"
          width="60"
          height="35"
          rx="6"
          fill="hsl(var(--primary))"
        />
        <rect
          x="305"
          y="185"
          width="50"
          height="3"
          rx="1"
          fill="hsl(var(--primary-foreground))"
          opacity="0.7"
        />
        <circle
          cx="315"
          cy="200"
          r="4"
          fill="hsl(var(--primary-foreground))"
          opacity="0.9"
        />
        <circle
          cx="325"
          cy="200"
          r="4"
          fill="hsl(var(--primary-foreground))"
          opacity="0.7"
        />
      </g>

      <circle
        cx="60"
        cy="150"
        r="3"
        fill="hsl(var(--primary))"
        opacity="0.6"
        className="float-animation"
      />
      <circle
        cx="340"
        cy="140"
        r="4"
        fill="hsl(var(--secondary))"
        opacity="0.6"
        className="float-delayed"
      />
      <circle
        cx="70"
        cy="180"
        r="2"
        fill="hsl(var(--accent))"
        opacity="0.6"
        className="float-delayed-2"
      />
      <circle
        cx="330"
        cy="200"
        r="3"
        fill="bg"
        opacity="0.6"
        className="float-animation"
      />
      <g className="float-delayed">
        <circle
          cx="100"
          cy="120"
          r="1.5"
          fill="hsl(var(--muted-foreground))"
          opacity="0.4"
        />
        <circle
          cx="300"
          cy="120"
          r="2"
          fill="hsl(var(--muted-foreground))"
          opacity="0.3"
        />
        <circle
          cx="150"
          cy="250"
          r="1"
          fill="hsl(var(--muted-foreground))"
          opacity="0.5"
        />
      </g>
    </svg>
  );
}

export default AuthIcon;
