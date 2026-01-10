import { ChapterLayout } from "@/components/ChapterLayout";
import { notFound } from "next/navigation";

// Define all chapters with their content and metadata
const chapters: Record<
  string,
  {
    title: string;
    chapterId: string;
    moduleId: number;
    content: React.ReactNode;
    prevChapter?: { slug: string; title: string };
    nextChapter?: { slug: string; title: string };
  }
> = {
  "introduction-to-physical-ai": {
    title: "Introduction to Physical AI",
    chapterId: "1.1",
    moduleId: 1,
    nextChapter: { slug: "ros2-architecture", title: "ROS 2 Architecture" },
    content: <IntroductionToPhysicalAI />,
  },
  "ros2-architecture": {
    title: "ROS 2 Architecture",
    chapterId: "1.2",
    moduleId: 1,
    prevChapter: { slug: "introduction-to-physical-ai", title: "Introduction to Physical AI" },
    nextChapter: { slug: "building-ros2-packages", title: "Building ROS 2 Packages" },
    content: <ROS2Architecture />,
  },
  "building-ros2-packages": {
    title: "Building ROS 2 Packages",
    chapterId: "1.3",
    moduleId: 1,
    prevChapter: { slug: "ros2-architecture", title: "ROS 2 Architecture" },
    nextChapter: { slug: "urdf-for-humanoids", title: "URDF for Humanoids" },
    content: <BuildingROS2Packages />,
  },
  "urdf-for-humanoids": {
    title: "URDF for Humanoids",
    chapterId: "1.4",
    moduleId: 1,
    prevChapter: { slug: "building-ros2-packages", title: "Building ROS 2 Packages" },
    nextChapter: { slug: "gazebo-simulation", title: "Gazebo Simulation" },
    content: <URDFForHumanoids />,
  },
  "gazebo-simulation": {
    title: "Gazebo Simulation Environment",
    chapterId: "2.1",
    moduleId: 2,
    prevChapter: { slug: "urdf-for-humanoids", title: "URDF for Humanoids" },
    nextChapter: { slug: "sensor-simulation", title: "Sensor Simulation" },
    content: <GazeboSimulation />,
  },
  "sensor-simulation": {
    title: "Sensor Simulation",
    chapterId: "2.2",
    moduleId: 2,
    prevChapter: { slug: "gazebo-simulation", title: "Gazebo Simulation" },
    nextChapter: { slug: "unity-for-robotics", title: "Unity for Robotics" },
    content: <SensorSimulation />,
  },
  "unity-for-robotics": {
    title: "Unity for Robot Visualization",
    chapterId: "2.3",
    moduleId: 2,
    prevChapter: { slug: "sensor-simulation", title: "Sensor Simulation" },
    nextChapter: { slug: "isaac-sim", title: "Isaac Sim" },
    content: <UnityForRobotics />,
  },
  "isaac-sim": {
    title: "NVIDIA Isaac Sim",
    chapterId: "3.1",
    moduleId: 3,
    prevChapter: { slug: "unity-for-robotics", title: "Unity for Robotics" },
    nextChapter: { slug: "isaac-ros", title: "Isaac ROS" },
    content: <IsaacSim />,
  },
  "isaac-ros": {
    title: "Isaac ROS",
    chapterId: "3.2",
    moduleId: 3,
    prevChapter: { slug: "isaac-sim", title: "Isaac Sim" },
    nextChapter: { slug: "navigation-nav2", title: "Navigation with Nav2" },
    content: <IsaacROS />,
  },
  "navigation-nav2": {
    title: "Navigation with Nav2",
    chapterId: "3.3",
    moduleId: 3,
    prevChapter: { slug: "isaac-ros", title: "Isaac ROS" },
    nextChapter: { slug: "sim-to-real", title: "Sim-to-Real Transfer" },
    content: <NavigationNav2 />,
  },
  "sim-to-real": {
    title: "Sim-to-Real Transfer",
    chapterId: "3.4",
    moduleId: 3,
    prevChapter: { slug: "navigation-nav2", title: "Navigation with Nav2" },
    nextChapter: { slug: "voice-to-action", title: "Voice-to-Action" },
    content: <SimToReal />,
  },
  "voice-to-action": {
    title: "Voice-to-Action",
    chapterId: "4.1",
    moduleId: 4,
    prevChapter: { slug: "sim-to-real", title: "Sim-to-Real Transfer" },
    nextChapter: { slug: "cognitive-planning", title: "Cognitive Planning" },
    content: <VoiceToAction />,
  },
  "cognitive-planning": {
    title: "Cognitive Planning with LLMs",
    chapterId: "4.2",
    moduleId: 4,
    prevChapter: { slug: "voice-to-action", title: "Voice-to-Action" },
    nextChapter: { slug: "multi-modal-interaction", title: "Multi-Modal Interaction" },
    content: <CognitivePlanning />,
  },
  "multi-modal-interaction": {
    title: "Multi-Modal Interaction",
    chapterId: "4.3",
    moduleId: 4,
    prevChapter: { slug: "cognitive-planning", title: "Cognitive Planning" },
    nextChapter: { slug: "capstone-project", title: "Capstone Project" },
    content: <MultiModalInteraction />,
  },
  "capstone-project": {
    title: "Capstone Project: The Autonomous Humanoid",
    chapterId: "4.4",
    moduleId: 4,
    prevChapter: { slug: "multi-modal-interaction", title: "Multi-Modal Interaction" },
    content: <CapstoneProject />,
  },
};

export async function generateStaticParams() {
  return Object.keys(chapters).map((slug) => ({ slug }));
}

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = chapters[slug];

  if (!chapter) {
    notFound();
  }

  return (
    <ChapterLayout
      title={chapter.title}
      chapterId={chapter.chapterId}
      moduleId={chapter.moduleId}
      prevChapter={chapter.prevChapter}
      nextChapter={chapter.nextChapter}
    >
      {chapter.content}
    </ChapterLayout>
  );
}

// Chapter Content Components

function IntroductionToPhysicalAI() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <p>By the end of this chapter, you will be able to:</p>
      <ul>
        <li>Define Physical AI and explain its significance in robotics</li>
        <li>Understand the concept of embodied intelligence</li>
        <li>Identify key sensor systems used in humanoid robots</li>
        <li>Describe the current landscape of humanoid robotics</li>
      </ul>

      <h2>What is Physical AI?</h2>
      <p>
        <strong>Physical AI</strong> represents a paradigm shift from traditional artificial intelligence confined to digital spaces.
        While conventional AI operates on data in virtual environments—processing text, images, or numerical data—Physical AI systems
        interact directly with the physical world. These systems must understand and respond to real-world physics, including gravity,
        friction, momentum, and the unpredictable nature of physical environments.
      </p>

      <p>
        The transition from digital AI to Physical AI requires solving fundamentally different challenges. A language model can
        generate text instantly, but a robot arm picking up an object must account for:
      </p>

      <ul>
        <li>Object weight and center of mass</li>
        <li>Surface texture and grip friction</li>
        <li>Collision avoidance with surrounding objects</li>
        <li>Real-time sensory feedback and adjustments</li>
        <li>Motor control precision and timing</li>
      </ul>

      <h2>Embodied Intelligence</h2>
      <p>
        <strong>Embodied Intelligence</strong> is the principle that true intelligence emerges from the interaction between a
        cognitive system and its physical body within an environment. Unlike disembodied AI, which processes abstract symbols,
        embodied AI learns through physical experience.
      </p>

      <p>
        Humanoid robots are particularly interesting for embodied intelligence research because they share our physical form.
        This allows them to:
      </p>

      <ul>
        <li>Navigate environments designed for humans (stairs, doorways, furniture)</li>
        <li>Use tools and interfaces designed for human hands</li>
        <li>Learn from human demonstrations more directly</li>
        <li>Interact naturally with humans in shared spaces</li>
      </ul>

      <h2>Sensor Systems Overview</h2>
      <p>Physical AI systems rely on multiple sensor modalities to perceive their environment:</p>

      <h3>LiDAR (Light Detection and Ranging)</h3>
      <p>
        LiDAR sensors emit laser pulses and measure their return time to create precise 3D maps of the environment.
        Modern humanoid robots use LiDAR for:
      </p>
      <ul>
        <li>Obstacle detection and avoidance</li>
        <li>Simultaneous Localization and Mapping (SLAM)</li>
        <li>Path planning and navigation</li>
      </ul>

      <h3>RGB and Depth Cameras</h3>
      <p>
        Cameras provide visual information essential for object recognition, gesture understanding, and scene comprehension.
        Depth cameras (like Intel RealSense) combine RGB with depth sensing for 3D perception.
      </p>

      <h3>Inertial Measurement Units (IMUs)</h3>
      <p>
        IMUs combine accelerometers and gyroscopes to measure acceleration and rotation. For humanoid robots, IMUs are critical for:
      </p>
      <ul>
        <li>Balance control during walking</li>
        <li>Fall detection and recovery</li>
        <li>Body orientation estimation</li>
      </ul>

      <h3>Force/Torque Sensors</h3>
      <p>
        These sensors measure forces and torques at joints and end-effectors, enabling:
      </p>
      <ul>
        <li>Compliant manipulation (gentle handling of objects)</li>
        <li>Contact detection</li>
        <li>Force feedback for teleoperation</li>
      </ul>

      <h2>The Humanoid Robotics Landscape</h2>
      <p>
        The field of humanoid robotics has seen remarkable progress in recent years. Key players include:
      </p>

      <ul>
        <li><strong>Boston Dynamics Atlas</strong>: Known for dynamic movements and parkour capabilities</li>
        <li><strong>Tesla Optimus</strong>: Focused on manufacturing and household tasks</li>
        <li><strong>Unitree H1/G1</strong>: Cost-effective humanoids with open SDK</li>
        <li><strong>Figure 01</strong>: Designed for general-purpose work alongside humans</li>
        <li><strong>Agility Robotics Digit</strong>: Built for logistics and warehouse operations</li>
      </ul>

      <h2>Why This Course Matters</h2>
      <p>
        The future of work will be a partnership between people, intelligent agents (AI software), and robots.
        This course prepares you to be at the forefront of this transformation by teaching you:
      </p>

      <ul>
        <li><strong>ROS 2</strong>: The standard middleware for robotics development</li>
        <li><strong>Simulation</strong>: Gazebo and Unity for safe robot testing</li>
        <li><strong>NVIDIA Isaac</strong>: Enterprise-grade tools for AI-powered robotics</li>
        <li><strong>VLA Models</strong>: Connecting language understanding to robot action</li>
      </ul>

      <h2>Summary</h2>
      <ul>
        <li>Physical AI extends artificial intelligence into the real world</li>
        <li>Embodied intelligence emerges from physical interaction with the environment</li>
        <li>Humanoid robots use multiple sensor modalities (LiDAR, cameras, IMUs, force sensors)</li>
        <li>The humanoid robotics field is rapidly advancing with multiple commercial players</li>
      </ul>

      <h2>Exercises</h2>
      <ol>
        <li>
          <strong>Research Exercise</strong>: Compare two humanoid robots (e.g., Atlas vs. Optimus). What are their
          main differences in design philosophy and target applications?
        </li>
        <li>
          <strong>Thought Exercise</strong>: Why might a humanoid form factor be advantageous over a wheeled robot
          for household tasks? What are the disadvantages?
        </li>
        <li>
          <strong>Sensor Analysis</strong>: For a robot tasked with picking up delicate objects (like eggs), which
          sensors would be most critical? Why?
        </li>
      </ol>
    </>
  );
}

function ROS2Architecture() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <p>By the end of this chapter, you will be able to:</p>
      <ul>
        <li>Explain why ROS 2 was developed and its advantages over ROS 1</li>
        <li>Understand the core concepts: Nodes, Topics, Services, and Actions</li>
        <li>Set up a ROS 2 development environment</li>
        <li>Create and run your first ROS 2 nodes</li>
      </ul>

      <h2>Why ROS 2?</h2>
      <p>
        The Robot Operating System (ROS) has been the de facto standard for robotics development since 2007. However,
        ROS 1 had limitations that made it unsuitable for production robotics:
      </p>

      <ul>
        <li><strong>No real-time support</strong>: Critical for safety in physical systems</li>
        <li><strong>Single point of failure</strong>: The ROS Master could crash the entire system</li>
        <li><strong>Limited security</strong>: No built-in authentication or encryption</li>
        <li><strong>Python 2 dependency</strong>: Outdated language support</li>
      </ul>

      <p>
        ROS 2 addresses all these issues while maintaining the powerful development paradigm that made ROS 1 popular.
      </p>

      <h2>ROS 2 Architecture Overview</h2>
      <p>
        ROS 2 is built on top of DDS (Data Distribution Service), an industry-standard middleware for real-time systems.
        This provides:
      </p>

      <ul>
        <li><strong>Decentralized discovery</strong>: No master node required</li>
        <li><strong>Quality of Service (QoS)</strong>: Configurable reliability and latency</li>
        <li><strong>Real-time capable</strong>: Deterministic communication when needed</li>
        <li><strong>Security</strong>: Built-in authentication and encryption</li>
      </ul>

      <h2>Core Concepts</h2>

      <h3>Nodes</h3>
      <p>
        A <strong>node</strong> is a process that performs computation. In ROS 2, robots are typically composed of many
        nodes working together. For example, a humanoid robot might have:
      </p>

      <ul>
        <li>A camera node processing visual data</li>
        <li>A motor controller node managing actuators</li>
        <li>A navigation node planning paths</li>
        <li>A speech recognition node processing voice commands</li>
      </ul>

      <pre><code className="language-python">{`import rclpy
from rclpy.node import Node

class MinimalNode(Node):
    def __init__(self):
        super().__init__('minimal_node')
        self.get_logger().info('Hello from ROS 2!')

def main():
    rclpy.init()
    node = MinimalNode()
    rclpy.spin(node)
    node.destroy_node()
    rclpy.shutdown()

if __name__ == '__main__':
    main()`}</code></pre>

      <h3>Topics</h3>
      <p>
        <strong>Topics</strong> are named buses for streaming data. Nodes can publish messages to topics or subscribe
        to receive them. This is the most common communication pattern in ROS 2.
      </p>

      <pre><code className="language-python">{`from std_msgs.msg import String

class Publisher(Node):
    def __init__(self):
        super().__init__('publisher')
        self.publisher = self.create_publisher(String, 'topic', 10)
        self.timer = self.create_timer(0.5, self.timer_callback)

    def timer_callback(self):
        msg = String()
        msg.data = 'Hello World'
        self.publisher.publish(msg)`}</code></pre>

      <h3>Services</h3>
      <p>
        <strong>Services</strong> provide request/response communication. Unlike topics (which are streaming), services
        are used for one-time operations like &quot;take a photo&quot; or &quot;move to position X&quot;.
      </p>

      <h3>Actions</h3>
      <p>
        <strong>Actions</strong> are for long-running tasks that need feedback and can be canceled. They combine the
        request/response pattern of services with continuous feedback, perfect for tasks like &quot;walk to the kitchen&quot;.
      </p>

      <h2>Installation</h2>
      <p>
        ROS 2 Humble (the current LTS release) requires Ubuntu 22.04. Here&apos;s a quick setup:
      </p>

      <pre><code className="language-bash">{`# Set up sources
sudo apt update && sudo apt install -y software-properties-common
sudo add-apt-repository universe

# Add ROS 2 GPG key
sudo apt update && sudo apt install curl -y
sudo curl -sSL https://raw.githubusercontent.com/ros/rosdistro/master/ros.key | sudo apt-key add -

# Add repository
sudo sh -c 'echo "deb http://packages.ros.org/ros2/ubuntu $(lsb_release -cs) main" > /etc/apt/sources.list.d/ros2.list'

# Install ROS 2 Humble
sudo apt update
sudo apt install ros-humble-desktop

# Source the setup file
source /opt/ros/humble/setup.bash`}</code></pre>

      <h2>Your First ROS 2 Application</h2>
      <p>
        Let&apos;s create a simple publisher-subscriber system. First, create a workspace:
      </p>

      <pre><code className="language-bash">{`mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src

# Create a package
ros2 pkg create --build-type ament_python my_first_package --dependencies rclpy std_msgs`}</code></pre>

      <h2>Summary</h2>
      <ul>
        <li>ROS 2 is built on DDS for real-time, secure, decentralized communication</li>
        <li>Nodes are the fundamental units of computation</li>
        <li>Topics provide streaming pub/sub communication</li>
        <li>Services handle request/response patterns</li>
        <li>Actions manage long-running tasks with feedback</li>
      </ul>

      <h2>Exercises</h2>
      <ol>
        <li>Install ROS 2 Humble on your system and run the demo nodes</li>
        <li>Create a publisher that sends your name every second</li>
        <li>Create a subscriber that prints received messages with timestamps</li>
      </ol>
    </>
  );
}

function BuildingROS2Packages() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Understand ROS 2 package structure</li>
        <li>Create Python packages with ament_python</li>
        <li>Work with launch files and parameters</li>
        <li>Build and test packages with colcon</li>
      </ul>

      <h2>ROS 2 Package Structure</h2>
      <p>A ROS 2 Python package has a specific structure:</p>

      <pre><code>{`my_package/
├── my_package/
│   ├── __init__.py
│   └── my_node.py
├── test/
├── resource/
│   └── my_package
├── package.xml
└── setup.py`}</code></pre>

      <h2>Creating a Package</h2>
      <pre><code className="language-bash">{`cd ~/ros2_ws/src
ros2 pkg create --build-type ament_python humanoid_controller \\
  --dependencies rclpy sensor_msgs geometry_msgs`}</code></pre>

      <h2>Package Configuration</h2>
      <p>The <code>package.xml</code> defines metadata and dependencies:</p>

      <pre><code className="language-xml">{`<?xml version="1.0"?>
<package format="3">
  <name>humanoid_controller</name>
  <version>0.0.1</version>
  <description>Humanoid robot controller</description>
  <maintainer email="you@example.com">Your Name</maintainer>
  <license>MIT</license>

  <depend>rclpy</depend>
  <depend>sensor_msgs</depend>
  <depend>geometry_msgs</depend>

  <export>
    <build_type>ament_python</build_type>
  </export>
</package>`}</code></pre>

      <h2>Launch Files</h2>
      <p>Launch files start multiple nodes with configuration:</p>

      <pre><code className="language-python">{`from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='humanoid_controller',
            executable='controller_node',
            name='main_controller',
            parameters=[{'speed': 1.0}]
        )
    ])`}</code></pre>

      <h2>Building with Colcon</h2>
      <pre><code className="language-bash">{`cd ~/ros2_ws
colcon build --packages-select humanoid_controller
source install/setup.bash`}</code></pre>

      <h2>Summary</h2>
      <ul>
        <li>ROS 2 packages have standardized structures</li>
        <li>package.xml defines dependencies and metadata</li>
        <li>Launch files orchestrate multiple nodes</li>
        <li>colcon is the standard build tool</li>
      </ul>
    </>
  );
}

function URDFForHumanoids() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Understand URDF (Unified Robot Description Format)</li>
        <li>Create links and joints for robot models</li>
        <li>Visualize robots in RViz</li>
        <li>Build a basic humanoid URDF</li>
      </ul>

      <h2>What is URDF?</h2>
      <p>
        URDF is an XML format for describing robot models. It defines the visual appearance,
        collision geometry, and physical properties of robots.
      </p>

      <h2>Links and Joints</h2>
      <p><strong>Links</strong> are rigid bodies. <strong>Joints</strong> connect links and define how they move.</p>

      <pre><code className="language-xml">{`<?xml version="1.0"?>
<robot name="simple_humanoid">
  <!-- Base (Torso) -->
  <link name="torso">
    <visual>
      <geometry>
        <box size="0.4 0.2 0.6"/>
      </geometry>
      <material name="blue">
        <color rgba="0 0 0.8 1"/>
      </material>
    </visual>
  </link>

  <!-- Head -->
  <link name="head">
    <visual>
      <geometry>
        <sphere radius="0.1"/>
      </geometry>
    </visual>
  </link>

  <joint name="neck" type="revolute">
    <parent link="torso"/>
    <child link="head"/>
    <origin xyz="0 0 0.35"/>
    <axis xyz="0 0 1"/>
    <limit lower="-1.57" upper="1.57" effort="10" velocity="1"/>
  </joint>
</robot>`}</code></pre>

      <h2>Joint Types</h2>
      <ul>
        <li><strong>fixed</strong>: No movement</li>
        <li><strong>revolute</strong>: Rotation with limits</li>
        <li><strong>continuous</strong>: Unlimited rotation</li>
        <li><strong>prismatic</strong>: Linear sliding</li>
      </ul>

      <h2>Visualizing in RViz</h2>
      <pre><code className="language-bash">{`ros2 launch urdf_tutorial display.launch.py model:=humanoid.urdf`}</code></pre>

      <h2>Summary</h2>
      <ul>
        <li>URDF describes robot structure in XML</li>
        <li>Links are rigid bodies, joints define connections</li>
        <li>Different joint types enable various movements</li>
        <li>RViz visualizes URDF models</li>
      </ul>
    </>
  );
}

function GazeboSimulation() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Set up Gazebo simulation environment</li>
        <li>Understand physics simulation fundamentals</li>
        <li>Load robots and worlds into Gazebo</li>
        <li>Connect Gazebo with ROS 2</li>
      </ul>

      <h2>Why Simulation?</h2>
      <p>
        Simulation allows safe, fast, and cheap testing of robot algorithms before deploying
        to real hardware. Gazebo provides:
      </p>
      <ul>
        <li>Realistic physics (gravity, friction, collisions)</li>
        <li>Sensor simulation (cameras, LiDAR, IMU)</li>
        <li>ROS 2 integration</li>
        <li>Multiple robot support</li>
      </ul>

      <h2>Installing Gazebo</h2>
      <pre><code className="language-bash">{`sudo apt install ros-humble-gazebo-ros-pkgs`}</code></pre>

      <h2>Launching Gazebo</h2>
      <pre><code className="language-bash">{`ros2 launch gazebo_ros gazebo.launch.py`}</code></pre>

      <h2>Loading Robots</h2>
      <pre><code className="language-python">{`from launch import LaunchDescription
from launch_ros.actions import Node

def generate_launch_description():
    return LaunchDescription([
        Node(
            package='gazebo_ros',
            executable='spawn_entity.py',
            arguments=['-entity', 'humanoid', '-file', 'humanoid.urdf']
        )
    ])`}</code></pre>

      <h2>Summary</h2>
      <ul>
        <li>Gazebo provides realistic physics simulation</li>
        <li>Integrates seamlessly with ROS 2</li>
        <li>Essential for safe algorithm development</li>
      </ul>
    </>
  );
}

function SensorSimulation() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Simulate LiDAR sensors in Gazebo</li>
        <li>Add camera plugins for vision</li>
        <li>Configure IMU simulation</li>
      </ul>

      <h2>LiDAR Simulation</h2>
      <p>Add LiDAR to your URDF using Gazebo plugins:</p>

      <pre><code className="language-xml">{`<gazebo reference="lidar_link">
  <sensor type="ray" name="lidar">
    <ray>
      <scan>
        <horizontal>
          <samples>360</samples>
          <resolution>1</resolution>
          <min_angle>-3.14</min_angle>
          <max_angle>3.14</max_angle>
        </horizontal>
      </scan>
      <range>
        <min>0.1</min>
        <max>10.0</max>
      </range>
    </ray>
    <plugin name="gazebo_ros_laser" filename="libgazebo_ros_ray_sensor.so">
      <ros>
        <remapping>~/out:=scan</remapping>
      </ros>
      <output_type>sensor_msgs/LaserScan</output_type>
    </plugin>
  </sensor>
</gazebo>`}</code></pre>

      <h2>Camera Simulation</h2>
      <pre><code className="language-xml">{`<gazebo reference="camera_link">
  <sensor type="camera" name="camera">
    <camera>
      <horizontal_fov>1.047</horizontal_fov>
      <image>
        <width>640</width>
        <height>480</height>
      </image>
    </camera>
    <plugin name="camera_plugin" filename="libgazebo_ros_camera.so">
      <ros>
        <remapping>~/image_raw:=camera/image</remapping>
      </ros>
    </plugin>
  </sensor>
</gazebo>`}</code></pre>

      <h2>Summary</h2>
      <ul>
        <li>Gazebo plugins simulate real sensor behavior</li>
        <li>Data published to ROS 2 topics</li>
        <li>Essential for testing perception algorithms</li>
      </ul>
    </>
  );
}

function UnityForRobotics() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Understand Unity Robotics Hub</li>
        <li>Connect Unity to ROS 2</li>
        <li>Create high-fidelity visualizations</li>
      </ul>

      <h2>Why Unity?</h2>
      <p>
        Unity provides photorealistic rendering and advanced human-robot interaction
        capabilities not available in Gazebo.
      </p>

      <h2>Unity Robotics Hub</h2>
      <p>
        The Unity Robotics Hub package enables ROS 2 communication through a TCP connection.
      </p>

      <h2>Setup</h2>
      <ol>
        <li>Install Unity 2021 LTS or newer</li>
        <li>Add Robotics packages via Package Manager</li>
        <li>Configure ROS TCP endpoint</li>
      </ol>

      <h2>Summary</h2>
      <ul>
        <li>Unity excels at visual fidelity</li>
        <li>Great for HRI research</li>
        <li>Complements Gazebo for different use cases</li>
      </ul>
    </>
  );
}

function IsaacSim() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Understand NVIDIA Omniverse and Isaac Sim</li>
        <li>Set up Isaac Sim environment</li>
        <li>Create synthetic training data</li>
      </ul>

      <h2>What is Isaac Sim?</h2>
      <p>
        NVIDIA Isaac Sim is a robotics simulation platform built on Omniverse. It provides:
      </p>
      <ul>
        <li>RTX-accelerated photorealistic rendering</li>
        <li>PhysX for accurate physics</li>
        <li>Synthetic data generation for ML</li>
        <li>Direct ROS 2 integration</li>
      </ul>

      <h2>Hardware Requirements</h2>
      <p>
        Isaac Sim requires an NVIDIA RTX GPU with at least 12GB VRAM. Recommended: RTX 4070 Ti or higher.
      </p>

      <h2>USD Format</h2>
      <p>
        Universal Scene Description (USD) is the native format for Isaac Sim, enabling
        collaborative 3D workflows.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>Isaac Sim is enterprise-grade simulation</li>
        <li>Requires powerful RTX hardware</li>
        <li>Excellent for synthetic data generation</li>
      </ul>
    </>
  );
}

function IsaacROS() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Understand Isaac ROS packages</li>
        <li>Implement hardware-accelerated perception</li>
        <li>Use VSLAM for navigation</li>
      </ul>

      <h2>Isaac ROS Overview</h2>
      <p>
        Isaac ROS provides GPU-accelerated ROS 2 packages for perception, including:
      </p>
      <ul>
        <li>Visual SLAM</li>
        <li>Object detection</li>
        <li>Depth estimation</li>
        <li>Semantic segmentation</li>
      </ul>

      <h2>VSLAM</h2>
      <p>
        Visual Simultaneous Localization and Mapping creates maps while tracking robot position
        using camera data.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>Isaac ROS accelerates perception on NVIDIA hardware</li>
        <li>VSLAM enables camera-based navigation</li>
        <li>Integrates with standard ROS 2 workflows</li>
      </ul>
    </>
  );
}

function NavigationNav2() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Understand Nav2 architecture</li>
        <li>Configure path planning for bipedal robots</li>
        <li>Work with costmaps and behavior trees</li>
      </ul>

      <h2>Nav2 Overview</h2>
      <p>
        Nav2 is the ROS 2 navigation stack, providing autonomous navigation capabilities.
      </p>

      <h2>Key Components</h2>
      <ul>
        <li><strong>Planner Server</strong>: Global path planning</li>
        <li><strong>Controller Server</strong>: Local trajectory following</li>
        <li><strong>Costmap</strong>: Obstacle representation</li>
        <li><strong>Behavior Tree</strong>: Navigation logic</li>
      </ul>

      <h2>Humanoid Considerations</h2>
      <p>
        Bipedal robots have unique navigation challenges including balance, step planning,
        and terrain assessment.
      </p>

      <h2>Summary</h2>
      <ul>
        <li>Nav2 provides complete navigation solution</li>
        <li>Behavior trees enable complex navigation logic</li>
        <li>Costmaps represent obstacles for planning</li>
      </ul>
    </>
  );
}

function SimToReal() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Understand the sim-to-real gap</li>
        <li>Apply domain randomization techniques</li>
        <li>Transfer learned policies to real robots</li>
      </ul>

      <h2>The Sim-to-Real Gap</h2>
      <p>
        Policies trained in simulation often fail on real robots due to differences in:
      </p>
      <ul>
        <li>Physics accuracy</li>
        <li>Sensor noise</li>
        <li>Actuator dynamics</li>
        <li>Environmental factors</li>
      </ul>

      <h2>Domain Randomization</h2>
      <p>
        Vary simulation parameters during training to create robust policies:
      </p>
      <ul>
        <li>Friction coefficients</li>
        <li>Mass distributions</li>
        <li>Sensor noise</li>
        <li>Lighting conditions</li>
      </ul>

      <h2>Summary</h2>
      <ul>
        <li>Sim-to-real transfer requires careful consideration</li>
        <li>Domain randomization improves robustness</li>
        <li>Iterative refinement on real hardware</li>
      </ul>
    </>
  );
}

function VoiceToAction() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Integrate speech recognition with robots</li>
        <li>Use OpenAI Whisper for transcription</li>
        <li>Convert voice commands to robot actions</li>
      </ul>

      <h2>Speech Recognition Pipeline</h2>
      <ol>
        <li>Audio capture from microphone</li>
        <li>Speech-to-text with Whisper</li>
        <li>Intent recognition</li>
        <li>Action mapping</li>
      </ol>

      <h2>Whisper Integration</h2>
      <pre><code className="language-python">{`import whisper

model = whisper.load_model("base")
result = model.transcribe("audio.wav")
command = result["text"]`}</code></pre>

      <h2>Summary</h2>
      <ul>
        <li>Voice enables natural human-robot interaction</li>
        <li>Whisper provides accurate transcription</li>
        <li>Intent recognition maps speech to actions</li>
      </ul>
    </>
  );
}

function CognitivePlanning() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Use LLMs for robot task planning</li>
        <li>Decompose natural language into actions</li>
        <li>Handle planning failures gracefully</li>
      </ul>

      <h2>LLM-Based Planning</h2>
      <p>
        Large Language Models can translate high-level commands like &quot;Clean the room&quot;
        into sequences of robot-executable actions.
      </p>

      <h2>Example Pipeline</h2>
      <pre><code className="language-python">{`from openai import OpenAI

client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",
    messages=[{
        "role": "system",
        "content": "You are a robot planner. Convert commands to action sequences."
    }, {
        "role": "user",
        "content": "Pick up the red cup from the table"
    }]
)

actions = parse_actions(response.choices[0].message.content)`}</code></pre>

      <h2>Summary</h2>
      <ul>
        <li>LLMs enable natural language task specification</li>
        <li>Planning requires grounding in robot capabilities</li>
        <li>Safety checks essential before execution</li>
      </ul>
    </>
  );
}

function MultiModalInteraction() {
  return (
    <>
      <h2>Learning Objectives</h2>
      <ul>
        <li>Combine speech, gesture, and vision</li>
        <li>Design multi-modal interaction systems</li>
        <li>Handle ambiguity in human communication</li>
      </ul>

      <h2>Multi-Modal Fusion</h2>
      <p>
        Humans communicate through multiple channels simultaneously. Effective robots must integrate:
      </p>
      <ul>
        <li>Speech (what is said)</li>
        <li>Gesture (pointing, waving)</li>
        <li>Gaze (where someone looks)</li>
        <li>Context (environment, history)</li>
      </ul>

      <h2>Disambiguation</h2>
      <p>
        &quot;Put it there&quot; requires understanding &quot;it&quot; (from context) and &quot;there&quot; (from gesture or gaze).
      </p>

      <h2>Summary</h2>
      <ul>
        <li>Multi-modal input improves understanding</li>
        <li>Context resolution is critical</li>
        <li>Graceful failure handling when uncertain</li>
      </ul>
    </>
  );
}

function CapstoneProject() {
  return (
    <>
      <h2>The Autonomous Humanoid</h2>
      <p>
        In this capstone project, you will integrate everything you have learned to create
        an autonomous humanoid robot that can:
      </p>
      <ol>
        <li>Receive voice commands</li>
        <li>Plan a path to a target location</li>
        <li>Navigate while avoiding obstacles</li>
        <li>Identify and manipulate objects</li>
      </ol>

      <h2>Project Requirements</h2>
      <ul>
        <li>ROS 2 Humble environment</li>
        <li>Gazebo or Isaac Sim simulation</li>
        <li>Humanoid robot model (URDF)</li>
        <li>Speech recognition (Whisper)</li>
        <li>Navigation (Nav2)</li>
        <li>Object detection (YOLO or similar)</li>
      </ul>

      <h2>Architecture</h2>
      <pre><code>{`[Microphone] → [Whisper] → [LLM Planner] → [Nav2] → [Robot]
                              ↓
                    [Object Detection]
                              ↓
                    [Manipulation Controller]`}</code></pre>

      <h2>Evaluation Criteria</h2>
      <ul>
        <li>Command understanding accuracy</li>
        <li>Navigation success rate</li>
        <li>Object manipulation precision</li>
        <li>End-to-end task completion</li>
      </ul>

      <h2>Congratulations!</h2>
      <p>
        You have completed the Physical AI & Humanoid Robotics course. You now have the
        foundation to build intelligent robots that can perceive, plan, and act in the physical world.
      </p>
    </>
  );
}
