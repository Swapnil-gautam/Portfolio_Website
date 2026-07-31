/**
 * Site content. Everything editable lives here — the rest of the JS just
 * renders it. Content is carried over from the v1 site at ../index.html.
 */
window.SITE = {
  name: "Swapnil Gautam",
  role: "Machine Learning Engineer",

  /* Replace with your key from https://web3forms.com (free, no backend).
     Until it's set, the contact form falls back to a mailto: link. */
  web3FormsKey: "",

  contact: {
    email: "swapnilgtm1998@gmail.com",
    phone: "+1 (551) 344-5848",
    location: "Hoboken, New Jersey, USA",
    linkedin: "https://www.linkedin.com/in/swapnil-gautam",
    // Add your GitHub profile URL and the icon/link appears automatically.
    github: ""
  },

  /* One entry renders a plain viewer; add more and a segmented switcher
     appears in the resume modal. */
  resumes: [{ id: "ml", label: "Machine Learning", url: "../Swapnil_Gautam.pdf" }],
  resumeUpdated: "Mar 2025",

  /* Typewriter under the name: types a phrase, holds, backspaces, next.
     The prefix stays put; only the phrases are typed. */
  heroPrefix: "I'm ",
  heroTyped: [
    "an ML Engineer",
    "a Problem Solver",
    "a Computer Vision Engineer",
    "a Robotics Geek",
    "an Avid Learner",
    "a Fitness Enthusiast",
    "a Traveler",
    "a Curious Being"
  ],
  /* Read by screen readers instead of the constantly-changing typed text. */
  heroAriaLabel: "Machine Learning, Computer Vision and Generative AI Engineer",

  /* More options, if you want to swap any of the above out.

     Personal / fun:
       "a Mountain Chaser"        "a Weekend Trekker"
       "a Gym Regular"            "an Early Riser"
       "a Camera Nerd"            "a Road-Trip Planner"
       "a Chai-Powered Debugger"  "a Late-Night Builder"
       "a Rabbit-Hole Explorer"   "a Serial Prototyper"
       "a Tinkerer at Heart"      "a Sci-Fi Reader"

     Professional:
       "a Deep Learning Engineer" "an Edge AI Tinkerer"
       "an Applied AI Engineer"   "an IEEE-published Roboticist"
       "a Hardware Tinkerer"      "a Builder of Things That See"   */


  about: {
    paragraphs: [
      "I enjoy building AI systems that move from research ideas to real products. My work sits at the intersection of computer vision, deep learning, generative AI, and edge deployment, and I like solving problems where model quality, product thinking, and real-world constraints all matter.",
      "Currently loving life in NYC. When I'm not building AI, you'll probably find me chasing trails, lifting weights, exploring a new corner of the city, getting lost in a good book, or watching a movie I'll inevitably overanalyze afterward."
    ],
    /* Cross-fades through these in array order, 8s on each, then loops.
       Filenames are numbered to match that order — to reshuffle, rename the
       originals in ../assets/img/myimgs/ and regenerate.

       These are web-sized copies (max 1200px, EXIF rotation baked in) built
       from the full-resolution originals: 13.4MB of phone photos down to
       0.8MB. The originals are gitignored. */
    images: [
      "../assets/img/myimgs/web/1.jpg",
      "../assets/img/myimgs/web/2.jpg",
      "../assets/img/myimgs/web/3.jpg",
      "../assets/img/myimgs/web/4.jpg",
      "../assets/img/myimgs/web/5.jpg"
    ]
  },

  experience: [
    {
      date: "Sep 2025 - Jan 2026",
      title: "Machine Learning Engineer",
      subtitle: "Conduit",
      subtitleLink: "https://conduit.inc/",
      location: "San Francisco, California, USA",
      bullets: [
        "Designed and deployed a scalable computer vision manufacturing monitoring system to improve Overall Equipment Effectiveness, achieving 86.7% OEE.",
        "Built an end-to-end machine utilization pipeline using YOLO, benchmarked models across 6+ machine states, and improved production monitoring accuracy by 45%.",
        "Fine-tuned and deployed PaddleOCR on edge devices for CNC HMI screen text recognition, enabling real-time ingestion through MQTT."
      ]
    },
    {
      date: "Jan 2025 - Aug 2025",
      title: "AI Research Assistant",
      subtitle: "WRS Lab",
      subtitleLink: "https://www.wrslab.com/",
      location: "Hoboken, New Jersey, USA",
      bullets: [
        "Developed a transformer-based model for center of pressure estimation from insole and IMU sensor data, reducing prediction error versus baseline LSTM models.",
        "Compared transformer performance with GPR and LSTM approaches for mitochondrial disease assessment using sensor, accelerometer, and gyroscope inputs."
      ]
    },
    {
      date: "Apr 2022 - Jun 2024",
      title: "Founding AI Engineer",
      subtitle: "Wizio AI Physio Coach",
      subtitleLink: "https://apps.apple.com/in/app/wizio-ai-physio-coach/id6450921777",
      location: "Pune, India",
      bullets: [
        "Led end-to-end development of the ML stack for Wizio, a real-time physiotherapy app, from data preprocessing and model development to testing, POC delivery, and deployment.",
        "Designed scalable Firebase-based pipelines and a LangChain-powered RAG chat interface, improving accuracy while reducing hallucinations and processing time by 70%.",
        "Managed and mentored a team of 4 ML engineers, accelerating product updates and boosting patient retention by 140% in 6 months."
      ]
    },
    {
      date: "Jul 2021 - Jan 2022",
      title: "Computer Vision Engineer",
      subtitle: "Camweara",
      subtitleLink: "https://camweara.com/",
      location: "Bangalore, India",
      bullets: [
        "Tested and validated custom image segmentation models using PyTorch and ONNX, reducing third-party API costs by 90%.",
        "Designed a custom hand-landmark detection model in TensorFlow, improving localization accuracy and reducing inference latency through quantization."
      ]
    }
  ],

  education: [
    {
      date: "2024 - 2026",
      title: "Master of Science — Applied Artificial Intelligence",
      subtitle: "Stevens Institute of Technology",
      location: "Hoboken, New Jersey, USA",
      bullets: [
        "GPA 3.8/4.0.",
        "Coursework: Machine Learning, Deep Learning, Natural Language Processing, Computer Vision."
      ]
    },
    {
      date: "2016 - 2020",
      title: "Bachelor of Technology — Computer Science (Mechatronics)",
      subtitle: "Narsee Monjee Institute of Management Studies",
      location: "Mumbai, India",
      bullets: [
        "Mechatronics track spanning embedded systems, control, robotics and computer science."
      ]
    }
  ],

  publications: [
    {
      date: "2023",
      title:
        "Revolutionizing Robotics: A Scalable and Versatile Mobile Robotic Arm for Modern Applications",
      subtitle: "IEEE PuneCon 2023",
      subtitleLink: "https://ieeexplore.ieee.org/document/10450145/keywords#keywords",
      location: "Pune, India",
      bullets: [
        "Presented a scalable mobile manipulator pairing a mobile base with a multi-DOF arm, covering the kinematics, control stack and application envelope."
      ]
    }
  ],

  projects: [
    {
      title: "Manufacturing Process Monitoring",
      category: "Machine Learning",
      description:
        "Computer vision system tracking CNC machine states and reading HMI screen text on edge devices, streaming utilization data over MQTT to lift OEE to 86.7%.",
      media: { type: "video", src: "../assets/vid/gif/ProcessMonitoring.mp4" },
      tags: ["YOLO", "PaddleOCR", "MQTT", "Edge"]
    },
    {
      title: "AI Tutor — Vision-Aware RAG for Course Materials",
      category: "Machine Learning",
      description:
        "Retrieval-augmented tutor over lecture material that reads diagrams and slides as well as text, combining hybrid search over ChromaDB with Gemini for grounded answers.",
      media: { type: "video", src: "../assets/vid/ai_tutor_full.mp4" },
      tags: ["Gemini", "RAG", "ChromaDB", "Hybrid Search"],
      caseStudy: "../AITutor.html"
    },
    {
      title: "Exercise Rep Detection & Form Correction",
      category: "Machine Learning",
      description:
        "Real-time rep counting and form correction from pose landmarks, running fully on-device inside a mobile physiotherapy app.",
      media: { type: "video", src: "../assets/vid/gif/Wizio.mp4" },
      tags: ["MediaPipe", "On-Device", "Real-time", "Mobile"],
      caseStudy: "../ExerciseRepDetection.html"
    },
    {
      title: "Virtual Try On",
      category: "Machine Learning",
      description:
        "Custom segmentation and hand-landmark models for virtual try-on, replacing third-party APIs and cutting inference cost by 90% through quantized ONNX deployment.",
      media: { type: "video", src: "../assets/vid/gif/Virtual_TryOn.mp4" },
      tags: ["Segmentation", "PyTorch", "ONNX", "Hand Landmarks"],
      caseStudy: "../VirtualTryOn.html"
    },
    {
      title: "Automatic Number Plate Recognition",
      category: "Machine Learning",
      description:
        "Two-stage pipeline that detects vehicle number plates in video streams and reads them with OCR, tuned for varied lighting and plate angles.",
      media: { type: "video", src: "../assets/vid/gif/ANPR.mp4" },
      tags: ["YOLO", "OCR", "Detection", "OpenCV"],
      caseStudy: "../ANPR.html"
    },
    {
      title: "3D Printer & Filament Extruder",
      category: "Robotics",
      description:
        "Single-extruder 3D printer built from scratch alongside a matching filament extruder — mechanical design, electronics and firmware end to end.",
      media: { type: "image", src: "../assets/img/Projects/SingleExtruder3DPrinter.png" },
      tags: ["Mechatronics", "CAD", "Hardware", "Firmware"],
      caseStudy: "../SingleExtruder3DPrinter.html"
    },
    {
      title: "Mobile Robotic Arm",
      category: "Robotics",
      description:
        "Scalable mobile manipulator pairing a driven base with a multi-DOF arm, covering kinematics and control. Published at IEEE PuneCon 2023.",
      media: { type: "image", src: "../assets/img/Projects/MobileRoboticArm.png" },
      tags: ["ROS", "Kinematics", "IEEE Published", "Robotics"],
      caseStudy: "../MobileRoboticArm.html"
    }
  ],

  techStack: [
    {
      category: "Machine Learning",
      color: "#22c55e",
      skills: [
        "PyTorch",
        "TensorFlow",
        "Keras",
        "scikit-learn",
        "Transformers",
        "LSTM",
        "Gaussian Processes",
        "Model Evaluation"
      ]
    },
    {
      category: "Computer Vision",
      color: "#06b6d4",
      skills: [
        "YOLO",
        "MediaPipe",
        "PaddleOCR",
        "OpenCV",
        "Segmentation",
        "Pose Estimation",
        "Object Tracking",
        "Quantization"
      ]
    },
    {
      category: "Generative AI",
      color: "#6366f1",
      skills: [
        "RAG",
        "LangChain",
        "ChromaDB",
        "Gemini",
        "OpenAI API",
        "Hybrid Search",
        "Vector Databases",
        "Prompt Engineering"
      ]
    },
    {
      category: "Languages & Data",
      color: "#3b82f6",
      skills: ["Python", "C++", "SQL", "NumPy", "Pandas", "MongoDB", "Firebase"]
    },
    {
      category: "Deployment & MLOps",
      color: "#f59e0b",
      skills: [
        "ONNX Runtime",
        "Docker",
        "MQTT",
        "Edge Devices",
        "Flask",
        "Git",
        "CI/CD",
        "Linux"
      ]
    },
    {
      category: "Robotics & Hardware",
      color: "#f43f5e",
      skills: ["ROS", "Kinematics", "Raspberry Pi", "Arduino", "Fusion 360", "Mechatronics"]
    }
  ]
};
