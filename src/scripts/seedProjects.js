import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';
import User from '../models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const users = await User.find();
    console.log(users);
    if (users.length < 4) throw new Error('At least 4 users are required to seed projects.');

    const [jonah, sharon, tapis, kelvin] = users;

    const projects = [
      // Infrastructure Projects (8)
      {
        name: 'Data Center Virtualization',
        description: 'Migrate physical servers to VMs for better scalability and management.',
        status: 'in-progress',
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-06-30'),
        owner: jonah._id,
        team: [sharon._id, tapis._id]
      },
      {
        name: 'Multi-Zone Kubernetes Cluster',
        description: 'Deploy a fault-tolerant Kubernetes cluster across three availability zones.',
        status: 'in-progress',
        startDate: new Date('2025-02-15'),
        endDate: new Date('2025-08-15'),
        owner: jonah._id,
        team: [kelvin._id, tapis._id]
      },
      {
        name: 'Disaster Recovery Site Setup',
        description: 'Establish a warm disaster recovery site 500 miles from primary data center.',
        status: 'not-started',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-01-31'),
        owner: sharon._id,
        team: [jonah._id]
      },
      {
        name: 'Network Segmentation Overhaul',
        description: 'Implement zero-trust network architecture with micro-segmentation.',
        status: 'on-hold',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-07-01'),
        owner: tapis._id,
        team: [sharon._id]
      },
 
      {
        name: 'IPv6 Migration',
        description: 'Full transition from IPv4 to IPv6 across all network infrastructure.',
        status: 'in-progress',
        startDate: new Date('2025-01-10'),
        endDate: new Date('2025-12-10'),
        owner: sharon._id,
        team: [tapis._id, kelvin._id]
      },
      {
        name: 'Edge Computing Deployment',
        description: 'Deploy micro data centers in 5 regional locations for low-latency processing.',
        status: 'not-started',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-09-01'),
        owner: jonah._id,
        team: [sharon._id, kelvin._id]
      },
      {
        name: 'Hyperconverged Infrastructure',
        description: 'Replace traditional servers with hyperconverged infrastructure nodes.',
        status: 'completed',
        startDate: new Date('2024-07-01'),
        endDate: new Date('2024-11-30'),
        owner: kelvin._id,
        team: [jonah._id, sharon._id]
      },

      // Development Projects (8)
      {
        name: 'Client Billing Automation',
        description: 'Develop a system to auto-bill clients based on VM usage and storage.',
        status: 'not-started',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-10-01'),
        owner: sharon._id,
        team: [jonah._id, kelvin._id]
      },
      {
        name: 'Internal Developer Platform',
        description: 'Build a self-service platform for developers to provision resources.',
        status: 'in-progress',
        startDate: new Date('2025-04-01'),
        endDate: new Date('2025-10-31'),
        owner: tapis._id,
        team: [kelvin._id, sharon._id]
      },
      {
        name: 'API Gateway Redesign',
        description: 'Implement Kong API gateway with improved rate limiting and analytics.',
        status: 'on-hold',
        startDate: new Date('2025-05-15'),
        endDate: new Date('2025-08-15'),
        owner: jonah._id,
        team: [tapis._id]
      },
      {
        name: 'Microservices Log Aggregation',
        description: 'Centralized logging solution for 50+ microservices with Elasticsearch.',
        status: 'in-progress',
        startDate: new Date('2025-03-20'),
        endDate: new Date('2025-07-20'),
        owner: sharon._id,
        team: [kelvin._id]
      },
      {
        name: 'CI/CD Pipeline Optimization',
        description: 'Reduce build times by 40% through parallelization and caching.',
        status: 'in-progress',
        startDate: new Date('2025-08-15'),
        endDate: new Date('2025-11-30'),
        owner: kelvin._id,
        team: [jonah._id, tapis._id]
      },
      {
        name: 'Technical Debt Reduction Sprint',
        description: 'Two-week focused effort to address accumulated technical debt.',
        status: 'not-started',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2025-09-15'),
        owner: tapis._id,
        team: [sharon._id, jonah._id, kelvin._id]
      },
      {
        name: 'Feature Flag Management System',
        description: 'Implement a robust system for gradual feature rollouts and quick rollbacks.',
        status: 'completed',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-15'),
        owner: sharon._id,
        team: [kelvin._id]
      },
      {
        name: 'Documentation Automation',
        description: 'Generate API documentation automatically from OpenAPI specs.',
        status: 'in-progress',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-05-31'),
        owner: jonah._id,
        team: [tapis._id]
      },

      // Monitoring & Security (7)
      {
        name: 'System Monitoring Dashboard',
        description: 'Develop a Vite-based UI to visualize server resource usage in real-time.',
        status: 'in-progress',
        startDate: new Date('2025-03-01'),
        endDate: new Date('2025-07-01'),
        owner: sharon._id,
        team: [kelvin._id, tapis._id]
      },
      {
        name: 'SIEM Implementation',
        description: 'Deploy Splunk for security information and event management.',
        status: 'completed',
        startDate: new Date('2025-11-01'),
        endDate: new Date('2026-02-28'),
        owner: kelvin._id,
        team: [jonah._id]
      },
      {
        name: 'Container Security Scanning',
        description: 'Integrate Trivy into CI pipeline to scan container images for vulnerabilities.',
        status: 'in-progress',
        startDate: new Date('2025-04-10'),
        endDate: new Date('2025-06-30'),
        owner: tapis._id,
        team: [sharon._id]
      },
      {
        name: 'DDoS Protection Enhancement',
        description: 'Upgrade network infrastructure to mitigate larger volumetric attacks.',
        status: 'not-started',
        startDate: new Date('2025-12-01'),
        endDate: new Date('2026-03-31'),
        owner: jonah._id,
        team: [kelvin._id, tapis._id]
      },
      {
        name: 'Certificate Automation',
        description: 'Implement automated TLS certificate renewal with HashiCorp Vault.',
        status: 'completed',
        startDate: new Date('2024-08-01'),
        endDate: new Date('2024-10-31'),
        owner: sharon._id,
        team: [jonah._id]
      },
     
      {
        name: 'Passwordless Authentication',
        description: 'Implement FIDO2 security keys for all internal systems.',
        status: 'in-progress',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-08-31'),
        owner: tapis._id,
        team: [jonah._id]
      },

      // Specialized Projects (7)
      {
        name: 'GPU Resource Scheduler',
        description: 'Build an allocator for Tesla V100 and H200 PCIe resources across VMs.',
        status: 'on-hold',
        startDate: new Date('2025-05-01'),
        endDate: new Date('2025-09-01'),
        owner: jonah._id,
        team: [kelvin._id]
      },
      {
        name: 'Telemedicine Platform Deployment',
        description: 'Setup multi-node Linux environment for high-availability telemedicine app.',
        status: 'not-started',
        startDate: new Date('2025-08-01'),
        endDate: new Date('2025-11-30'),
        owner: tapis._id,
        team: [jonah._id, kelvin._id]
      },
      {
        name: 'AI Training Cluster',
        description: 'Stand up dedicated Kubernetes cluster for ML training workloads.',
        status: 'in-progress',
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-10-31'),
        owner: kelvin._id,
        team: [sharon._id]
      },
      {
        name: 'Blockchain Node Infrastructure',
        description: 'Deploy and maintain Ethereum archive nodes for financial applications.',
        status: 'completed',
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-04-30'),
        owner: sharon._id,
        team: [tapis._id]
      },
      {
        name: 'High-Frequency Trading Network',
        description: 'Optimize network stack for sub-microsecond latency trading system.',
        status: 'completed',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2024-12-15'),
        owner: jonah._id,
        team: [kelvin._id, tapis._id]
      },
      {
        name: 'IoT Device Management Platform',
        description: 'Build scalable infrastructure to manage 100,000+ IoT devices.',
        status: 'in-progress',
        startDate: new Date('2025-04-15'),
        endDate: new Date('2025-09-15'),
        owner: tapis._id,
        team: [sharon._id, jonah._id]
      },
      {
        name: 'AR/VR Rendering Farm',
        description: 'Deploy GPU servers for cloud-based AR/VR content rendering.',
        status: 'not-started',
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-06-30'),
        owner: kelvin._id,
        team: [jonah._id]
      }
    ];

    await Project.insertMany(projects);
    console.log('✅ 30 Realistic Projects Seeded');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedProjects();