// Data processing utilities for DDoS detection
export interface NetworkPacket {
  timestamp: number
  sourceIP: string
  destIP: string
  sourcePort: number
  destPort: number
  protocol: string
  packetSize: number
  flags: string[]
  ttl: number
  windowSize: number
  deviceType: string
  isAttack: boolean
  attackType?: string
}

export interface ProcessedFeatures {
  packetRate: number
  avgPacketSize: number
  protocolDistribution: Record<string, number>
  flagFrequency: Record<string, number>
  entropyScore: number
  portScanIndicator: number
  synFloodIndicator: number
  volumeAnomalyScore: number
  deviceBehaviorScore: number
}

export class DataProcessor {
  private static readonly IOT_DEVICES = [
    "smart_camera",
    "smart_thermostat",
    "smart_doorbell",
    "smart_light",
    "smart_speaker",
    "smart_tv",
    "smart_refrigerator",
    "smart_watch",
    "industrial_sensor",
    "medical_device",
    "smart_car",
    "drone",
  ]

  // CICIoT2023 attack types
  private static readonly ATTACK_TYPES = [
    "DDoS-SYN_Flood",
    "DDoS-ACK_Fragmentation",
    "Backdoor_Malware",
    "Recon-PortScan",
  ]

  static async loadCICDDoS2019Dataset(): Promise<NetworkPacket[]> {
    return this.loadTONIoTDataset()
  }

  static async loadTONIoTDataset(): Promise<NetworkPacket[]> {
    const mockData: NetworkPacket[] = []
    const baseTime = Date.now()

    for (let i = 0; i < 5000; i++) {
      const isAttack = Math.random() > 0.88 // 12% attack rate
      const deviceType = this.IOT_DEVICES[Math.floor(Math.random() * this.IOT_DEVICES.length)]

      const sourceIP = this.generateRealisticIP(deviceType)
      const destIP = this.generateDestinationIP(isAttack)

      const protocol = this.selectProtocolForDevice(deviceType, isAttack)
      const { sourcePort, destPort } = this.generatePorts(protocol, deviceType, isAttack)

      mockData.push({
        timestamp: baseTime - i * (Math.random() * 2000 + 500),
        sourceIP,
        destIP,
        sourcePort,
        destPort,
        protocol,
        packetSize: this.generatePacketSize(protocol, deviceType, isAttack),
        flags: this.generateFlags(protocol, isAttack),
        ttl: this.generateTTL(deviceType),
        windowSize: this.generateWindowSize(protocol),
        deviceType,
        isAttack,
        attackType: isAttack ? this.ATTACK_TYPES[Math.floor(Math.random() * this.ATTACK_TYPES.length)] : undefined,
      })
    }

    return mockData.sort((a, b) => b.timestamp - a.timestamp)
  }

  private static generateRealisticIP(deviceType: string): string {
    const subnets = {
      smart_camera: "192.168.1",
      smart_thermostat: "192.168.2",
      industrial_sensor: "10.0.1",
      medical_device: "172.16.1",
      default: "192.168.0",
    }

    const subnet = subnets[deviceType as keyof typeof subnets] || subnets.default
    return `${subnet}.${Math.floor(Math.random() * 254) + 1}`
  }

  private static generateDestinationIP(isAttack: boolean): string {
    if (isAttack) {
      // Attackers often target specific servers
      const targets = ["203.0.113.1", "198.51.100.1", "192.0.2.1"]
      return targets[Math.floor(Math.random() * targets.length)]
    }
    return `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
  }

  private static selectProtocolForDevice(deviceType: string, isAttack: boolean): string {
    if (isAttack) {
      return ["TCP", "UDP", "ICMP"][Math.floor(Math.random() * 3)]
    }

    const deviceProtocols = {
      smart_camera: ["TCP", "UDP"],
      smart_thermostat: ["TCP"],
      industrial_sensor: ["UDP", "TCP"],
      medical_device: ["TCP"],
      default: ["TCP", "UDP"],
    }

    const protocols = deviceProtocols[deviceType as keyof typeof deviceProtocols] || deviceProtocols.default
    return protocols[Math.floor(Math.random() * protocols.length)]
  }

  private static generatePorts(protocol: string, deviceType: string, isAttack: boolean) {
    if (isAttack) {
      return {
        sourcePort: Math.floor(Math.random() * 65535) + 1,
        destPort: [80, 443, 22, 21, 25, 53, 3389][Math.floor(Math.random() * 7)],
      }
    }

    const commonPorts = {
      smart_camera: { source: 8080, dest: 554 }, // RTSP
      smart_thermostat: { source: 8443, dest: 443 },
      industrial_sensor: { source: 502, dest: 502 }, // Modbus
      medical_device: { source: 2575, dest: 443 },
      default: { source: Math.floor(Math.random() * 65535) + 1024, dest: 443 },
    }

    const ports = commonPorts[deviceType as keyof typeof commonPorts] || commonPorts.default
    return { sourcePort: ports.source, destPort: ports.dest }
  }

  private static generatePacketSize(protocol: string, deviceType: string, isAttack: boolean): number {
    if (isAttack) {
      // DDoS attacks often use specific packet sizes
      return Math.random() > 0.5 ? 1500 : Math.floor(Math.random() * 64) + 28
    }

    const deviceSizes = {
      smart_camera: () => Math.floor(Math.random() * 1400) + 100, // Video data
      smart_thermostat: () => Math.floor(Math.random() * 200) + 50, // Small data
      industrial_sensor: () => Math.floor(Math.random() * 100) + 40, // Sensor readings
      medical_device: () => Math.floor(Math.random() * 500) + 100, // Medical data
      default: () => Math.floor(Math.random() * 1500) + 64,
    }

    const sizeGenerator = deviceSizes[deviceType as keyof typeof deviceSizes] || deviceSizes.default
    return sizeGenerator()
  }

  private static generateFlags(protocol: string, isAttack: boolean): string[] {
    if (protocol !== "TCP") return []

    if (isAttack) {
      // Common attack patterns
      const attackPatterns = [
        ["SYN"], // SYN flood
        ["SYN", "ACK"], // Spoofed responses
        ["FIN", "RST"], // Connection disruption
        ["PSH", "ACK"], // Data flooding
      ]
      return attackPatterns[Math.floor(Math.random() * attackPatterns.length)]
    }

    // Normal TCP communication patterns
    const normalPatterns = [["SYN"], ["SYN", "ACK"], ["ACK"], ["PSH", "ACK"], ["FIN", "ACK"], ["RST"]]
    return normalPatterns[Math.floor(Math.random() * normalPatterns.length)]
  }

  private static generateTTL(deviceType: string): number {
    const deviceTTLs = {
      smart_camera: () => Math.floor(Math.random() * 10) + 60, // Shorter hops
      industrial_sensor: () => Math.floor(Math.random() * 5) + 62, // Local network
      medical_device: () => Math.floor(Math.random() * 8) + 58, // Controlled environment
      default: () => Math.floor(Math.random() * 20) + 50,
    }

    const ttlGenerator = deviceTTLs[deviceType as keyof typeof deviceTTLs] || deviceTTLs.default
    return ttlGenerator()
  }

  private static generateWindowSize(protocol: string): number {
    if (protocol !== "TCP") return 0
    const commonSizes = [8192, 16384, 32768, 65535]
    return commonSizes[Math.floor(Math.random() * commonSizes.length)]
  }

  static extractFeatures(packets: NetworkPacket[]): ProcessedFeatures {
    const timeWindow = 60000
    const recentPackets = packets.filter((p) => Date.now() - p.timestamp < timeWindow)

    const packetRate = recentPackets.length / (timeWindow / 1000)
    const avgPacketSize = recentPackets.reduce((sum, p) => sum + p.packetSize, 0) / recentPackets.length

    const protocolDistribution: Record<string, number> = {}
    const flagFrequency: Record<string, number> = {}

    recentPackets.forEach((packet) => {
      protocolDistribution[packet.protocol] = (protocolDistribution[packet.protocol] || 0) + 1
      packet.flags.forEach((flag) => {
        flagFrequency[flag] = (flagFrequency[flag] || 0) + 1
      })
    })

    const entropyScore = this.calculateEntropy(recentPackets.map((p) => p.sourceIP))
    const portScanIndicator = this.detectPortScan(recentPackets)
    const synFloodIndicator = this.detectSynFlood(recentPackets)
    const volumeAnomalyScore = this.calculateVolumeAnomaly(recentPackets)
    const deviceBehaviorScore = this.analyzeDeviceBehavior(recentPackets)

    return {
      packetRate,
      avgPacketSize,
      protocolDistribution,
      flagFrequency,
      entropyScore,
      portScanIndicator,
      synFloodIndicator,
      volumeAnomalyScore,
      deviceBehaviorScore,
    }
  }

  private static detectPortScan(packets: NetworkPacket[]): number {
    const portMap = new Map<string, Set<number>>()

    packets.forEach((packet) => {
      if (!portMap.has(packet.sourceIP)) {
        portMap.set(packet.sourceIP, new Set())
      }
      portMap.get(packet.sourceIP)!.add(packet.destPort)
    })

    let maxPorts = 0
    portMap.forEach((ports) => {
      maxPorts = Math.max(maxPorts, ports.size)
    })

    return Math.min(maxPorts / 100, 1) // Normalize to 0-1
  }

  private static detectSynFlood(packets: NetworkPacket[]): number {
    const synCount = packets.filter(
      (p) => p.protocol === "TCP" && p.flags.includes("SYN") && !p.flags.includes("ACK"),
    ).length

    const totalTCP = packets.filter((p) => p.protocol === "TCP").length
    return totalTCP > 0 ? synCount / totalTCP : 0
  }

  private static calculateVolumeAnomaly(packets: NetworkPacket[]): number {
    const bytesPerSecond = packets.reduce((sum, p) => sum + p.packetSize, 0) / 60
    const normalThreshold = 1000000 // 1MB/s baseline
    return Math.min(bytesPerSecond / normalThreshold, 5) // Cap at 5x normal
  }

  private static analyzeDeviceBehavior(packets: NetworkPacket[]): number {
    const deviceBehavior = new Map<string, { packets: number; avgSize: number }>()

    packets.forEach((packet) => {
      const key = `${packet.deviceType}-${packet.sourceIP}`
      if (!deviceBehavior.has(key)) {
        deviceBehavior.set(key, { packets: 0, avgSize: 0 })
      }
      const behavior = deviceBehavior.get(key)!
      behavior.packets++
      behavior.avgSize = (behavior.avgSize + packet.packetSize) / 2
    })

    let anomalyScore = 0
    deviceBehavior.forEach((behavior) => {
      // Detect unusual packet rates or sizes for device types
      if (behavior.packets > 100 || behavior.avgSize > 1400) {
        anomalyScore += 0.1
      }
    })

    return Math.min(anomalyScore, 1)
  }

  // Simplified entropy calculation
  private static calculateEntropy(values: string[]): number {
    const frequency: Record<string, number> = {}
    values.forEach((value) => {
      frequency[value] = (frequency[value] || 0) + 1
    })

    const total = values.length
    let entropy = 0

    Object.values(frequency).forEach((count) => {
      const probability = count / total
      entropy -= probability * Math.log2(probability)
    })

    return entropy
  }

  static async encryptFeatures(features: ProcessedFeatures): Promise<string> {
    // Mock AES encryption (in real implementation, use proper crypto library)
    const serialized = JSON.stringify(features)
    const encrypted = btoa(serialized) // Base64 encoding as mock encryption
    return encrypted
  }

  static async decryptFeatures(encryptedData: string): Promise<ProcessedFeatures> {
    // Mock AES decryption
    const decrypted = atob(encryptedData)
    return JSON.parse(decrypted)
  }
}
