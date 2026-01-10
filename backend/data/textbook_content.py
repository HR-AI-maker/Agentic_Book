"""
Textbook content for RAG ingestion
Physical AI & Humanoid Robotics
"""

CHAPTERS = [
    {
        "chapter": "1.1",
        "title": "Introduction to Physical AI",
        "content": """Physical AI represents a paradigm shift from traditional artificial intelligence confined to digital spaces. While conventional AI operates on data in virtual environments—processing text, images, or numerical data—Physical AI systems interact directly with the physical world. These systems must understand and respond to real-world physics, including gravity, friction, momentum, and the unpredictable nature of physical environments.

The transition from digital AI to Physical AI requires solving fundamentally different challenges. A language model can generate text instantly, but a robot arm picking up an object must account for object weight and center of mass, surface texture and grip friction, collision avoidance with surrounding objects, real-time sensory feedback and adjustments, and motor control precision and timing.

Embodied Intelligence is the principle that true intelligence emerges from the interaction between a cognitive system and its physical body within an environment. Unlike disembodied AI, which processes abstract symbols, embodied AI learns through physical experience. Humanoid robots are particularly interesting for embodied intelligence research because they share our physical form, allowing them to navigate environments designed for humans, use tools designed for human hands, learn from human demonstrations, and interact naturally with humans.

Physical AI systems rely on multiple sensor modalities: LiDAR for 3D mapping and obstacle detection, RGB and depth cameras for visual perception, IMUs for balance and orientation, and force/torque sensors for manipulation. Key humanoid robots include Boston Dynamics Atlas, Tesla Optimus, Unitree H1/G1, Figure 01, and Agility Robotics Digit."""
    },
    {
        "chapter": "1.2",
        "title": "ROS 2 Architecture",
        "content": """ROS 2 (Robot Operating System 2) is built on DDS (Data Distribution Service), an industry-standard middleware for real-time systems. ROS 2 addresses limitations of ROS 1 including no real-time support, single point of failure with ROS Master, limited security, and Python 2 dependency.

ROS 2 provides decentralized discovery (no master node required), Quality of Service (QoS) for configurable reliability and latency, real-time capability, and built-in security with authentication and encryption.

Core concepts include Nodes (processes that perform computation), Topics (named buses for streaming data with publish/subscribe), Services (request/response communication for one-time operations), and Actions (long-running tasks with feedback that can be canceled).

A typical humanoid robot might have nodes for camera processing, motor control, navigation, and speech recognition. Topics enable data flow between nodes using messages. Services handle discrete operations, while Actions manage complex tasks like "walk to the kitchen" with continuous feedback."""
    },
    {
        "chapter": "1.3",
        "title": "Building ROS 2 Packages",
        "content": """ROS 2 packages have standardized structures. A Python package includes the package directory with __init__.py and node files, test directory, resource directory, package.xml for metadata and dependencies, and setup.py for installation.

Packages are created with: ros2 pkg create --build-type ament_python package_name --dependencies rclpy sensor_msgs

The package.xml defines metadata (name, version, description, maintainer, license) and dependencies. Launch files orchestrate multiple nodes with configuration using Python launch descriptions.

Building uses colcon: colcon build --packages-select package_name, then source install/setup.bash. This workflow enables modular robot development with reusable components."""
    },
    {
        "chapter": "1.4",
        "title": "URDF for Humanoids",
        "content": """URDF (Unified Robot Description Format) is an XML format for describing robot models. It defines visual appearance, collision geometry, and physical properties.

Links are rigid bodies with visual geometry (how it looks), collision geometry (for physics), and inertial properties (mass, inertia). Joints connect links and define movement: fixed (no movement), revolute (rotation with limits), continuous (unlimited rotation), and prismatic (linear sliding).

A humanoid URDF includes a torso as base, head connected via neck joint, arms with shoulder/elbow/wrist joints, and legs with hip/knee/ankle joints. Each joint specifies parent link, child link, origin position, rotation axis, and limits (position, effort, velocity).

RViz visualizes URDF models: ros2 launch urdf_tutorial display.launch.py model:=humanoid.urdf"""
    },
    {
        "chapter": "2.1",
        "title": "Gazebo Simulation Environment",
        "content": """Gazebo provides realistic physics simulation for safe, fast, and cheap testing of robot algorithms. Features include realistic physics (gravity, friction, collisions), sensor simulation (cameras, LiDAR, IMU), ROS 2 integration, and multi-robot support.

Installation: sudo apt install ros-humble-gazebo-ros-pkgs

Robots are spawned into Gazebo using spawn_entity.py with URDF files. The simulation enables testing navigation, manipulation, and perception algorithms before deployment to real hardware, significantly reducing development costs and risks."""
    },
    {
        "chapter": "2.2",
        "title": "Sensor Simulation",
        "content": """Gazebo plugins simulate real sensor behavior and publish data to ROS 2 topics. LiDAR simulation uses ray sensors with configurable samples, resolution, angle range, and distance range. Data publishes as sensor_msgs/LaserScan.

Camera simulation configures field of view, resolution, and frame rate. Depth cameras combine RGB with depth sensing. IMU simulation provides acceleration and angular velocity data for balance control.

These simulated sensors behave like real hardware, enabling perception algorithm development and testing in simulation before real-world deployment."""
    },
    {
        "chapter": "2.3",
        "title": "Unity for Robot Visualization",
        "content": """Unity provides photorealistic rendering and advanced human-robot interaction capabilities beyond Gazebo. The Unity Robotics Hub enables ROS 2 communication through TCP connection.

Setup requires Unity 2021 LTS or newer, Robotics packages via Package Manager, and ROS TCP endpoint configuration. Unity excels at visual fidelity for presentations, HRI research with realistic human models, and scenarios requiring advanced graphics."""
    },
    {
        "chapter": "3.1",
        "title": "NVIDIA Isaac Sim",
        "content": """NVIDIA Isaac Sim is a robotics simulation platform built on Omniverse providing RTX-accelerated photorealistic rendering, PhysX for accurate physics, synthetic data generation for ML, and direct ROS 2 integration.

Hardware requirements: NVIDIA RTX GPU with at least 12GB VRAM (RTX 4070 Ti or higher recommended). USD (Universal Scene Description) is the native format enabling collaborative 3D workflows.

Isaac Sim enables domain randomization for robust policy training and generates synthetic training data for perception models."""
    },
    {
        "chapter": "3.2",
        "title": "Isaac ROS",
        "content": """Isaac ROS provides GPU-accelerated ROS 2 packages for perception including Visual SLAM for camera-based mapping and localization, object detection, depth estimation, and semantic segmentation.

VSLAM (Visual Simultaneous Localization and Mapping) creates maps while tracking robot position using camera data alone. This enables navigation without expensive LiDAR in some applications.

Isaac ROS accelerates perception pipelines on NVIDIA hardware while maintaining standard ROS 2 interfaces."""
    },
    {
        "chapter": "3.3",
        "title": "Navigation with Nav2",
        "content": """Nav2 is the ROS 2 navigation stack providing autonomous navigation. Key components include Planner Server for global path planning, Controller Server for local trajectory following, Costmap for obstacle representation, and Behavior Tree for navigation logic.

Costmaps represent the environment as occupancy grids with obstacle costs. Global planners find paths through the costmap, while local controllers follow paths while avoiding dynamic obstacles.

Humanoid navigation has unique challenges: balance maintenance during movement, step planning for stairs and uneven terrain, and narrow passage navigation with bipedal gait."""
    },
    {
        "chapter": "3.4",
        "title": "Sim-to-Real Transfer",
        "content": """The sim-to-real gap causes policies trained in simulation to fail on real robots due to differences in physics accuracy, sensor noise, actuator dynamics, and environmental factors.

Domain randomization varies simulation parameters during training: friction coefficients, mass distributions, sensor noise, and lighting conditions. This creates robust policies that generalize to real-world variations.

Transfer requires iterative refinement: train in simulation with randomization, test on real hardware, identify failure modes, improve simulation fidelity, and repeat."""
    },
    {
        "chapter": "4.1",
        "title": "Voice-to-Action",
        "content": """Voice-to-action enables natural human-robot interaction through speech. The pipeline includes audio capture from microphone, speech-to-text with Whisper, intent recognition, and action mapping.

OpenAI Whisper provides accurate multilingual transcription. Integration: model = whisper.load_model("base"); result = model.transcribe("audio.wav").

Intent recognition extracts actionable commands from transcribed text, then maps to robot capabilities. Error handling addresses ambient noise, unclear speech, and out-of-vocabulary commands."""
    },
    {
        "chapter": "4.2",
        "title": "Cognitive Planning with LLMs",
        "content": """Large Language Models translate high-level commands like "Clean the room" into sequences of robot-executable actions. The LLM acts as a task planner, decomposing complex instructions into primitive actions.

Planning requires grounding in robot capabilities - the LLM must know what actions are available. Safety checks validate planned actions before execution to prevent dangerous movements.

Example: "Pick up the red cup" becomes: 1) locate red cup, 2) move arm to cup position, 3) open gripper, 4) grasp cup, 5) lift cup. Each step maps to actual robot commands."""
    },
    {
        "chapter": "4.3",
        "title": "Multi-Modal Interaction",
        "content": """Humans communicate through multiple channels simultaneously. Effective robots integrate speech (what is said), gesture (pointing, waving), gaze (where someone looks), and context (environment, history).

Disambiguation resolves references: "Put it there" requires understanding "it" from context and "there" from gesture or gaze direction. Multi-modal fusion combines signals to reduce ambiguity.

When uncertain, robots should ask clarifying questions rather than guess. Graceful failure handling maintains user trust."""
    },
    {
        "chapter": "4.4",
        "title": "Capstone Project: The Autonomous Humanoid",
        "content": """The capstone integrates all course concepts: voice commands via Whisper, LLM planning for task decomposition, Nav2 navigation, and object manipulation.

Architecture: Microphone -> Whisper -> LLM Planner -> Nav2 -> Robot, with parallel object detection feeding manipulation controller.

Requirements: ROS 2 Humble, Gazebo or Isaac Sim, humanoid URDF, Whisper integration, Nav2 navigation, and object detection (YOLO or similar).

Evaluation criteria: command understanding accuracy, navigation success rate, object manipulation precision, and end-to-end task completion."""
    }
]
