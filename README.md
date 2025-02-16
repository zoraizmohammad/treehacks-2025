# CipherShield

**Cipher Shield** is a decentralized data aggregation platform that leverages advanced **homomorphic encryption** and **blockchain** technology to provide secure, privacy-preserving insights. This document outlines the inspiration behind our project, how it works, our architecture, the challenges we faced, our learnings, and our future roadmap.

## Table of Contents
- [Inspiration](#inspiration)
- [What It Does](#what-it-does)
- [How We Built It](#how-we-built-it)
- [Challenges We Ran Into](#challenges-we-ran-into)
- [Accomplishments That We’re Proud Of](#accomplishments-that-were-proud-of)
- [What We Learned](#what-we-learned)
- [What’s Next for Cipher Shield](#whats-next-for-cipher-shield)

## Inspiration
The inspiration for our project came from a **problem-based approach** to ideation. As students, we frequently fill out job applications that require demographic data. Most applicants simply opt out, as there appears to be no tangible benefit—only a potential downside if the information is **illegally misused** to negatively affect applications.

> **Note:** Despite these concerns, demographic collection is crucial for detecting trends that may expose discrimination. In fields like **employment**, **healthcare**, **loans**, and **credit cards**, collecting this data is often mandated by the federal government.  
>  
> In an era defined by **decentralization** and advanced **encryption schemes**, we believe there is no reason for such sensitive information to be misused, rendering harmful practices **mathematically impossible**.

## What It Does
**Cipher Shield** serves as a trusted third party that provides secure data aggregation services via the **blockchain**. It empowers companies to extract aggregate statistical insights from **homomorphically encrypted data**, ensuring that individual profiles remain completely private.

## How We Built It
### Blockchain Integration
- **Immutable Records:** Every aggregation request is stored on the blockchain, creating a transparent, permanent record.
- **On-Chain Validation:**  
  Before any homomorphic computation begins, our smart contract conducts a critical on-chain validation to ensure that there are enough records to prevent reverse engineering.  
  - If insufficient data points exist, the contract automatically **rejects the request**.
- **Audit Trail:**  
  Once validated and computed, the aggregated result is stored on-chain, ensuring every step is permanently verifiable.

### Technology Stack
- **Business Logic:** Written entirely in `C++` and `solidity` to handle complex encryption schemes and blockchain operations.
- **Encryption:** Utilizes the **OpenFHE** library for homomorphic encryption operations and key generation.
- **Demo Ecosystem:** As a B2B product, our demo features a full demo business, which necessitated a complete backend and frontend solution.

## Challenges We Ran Into
We encountered several challenges during the development process:
- **Homomorphic Encryption Implementation:**  
  Implementing our custom design in the **OpenFHE** library, particularly with the dual private key setup that wasn’t available out of the box.
- **Backend Development:**  
  Developing the backend in `C++` to manage data aggregation and ensuring the proper serialization/deserialization for key exchange.
- **Ciphertext Management:**  
  Handling large payloads of ciphertext in communications between the company and server, as well as storing this data securely.

## Accomplishments That We’re Proud Of
- **Pioneering Implementation:**  
  Created the **first-ever implementation** of a split key homomorphic encryption scheme that is also verified through blockchain technology.
- **Deep Technical Insights:**  
  Gained extensive knowledge about **homomorphic encryption** and **blockchain** technologies.
- **Full-Stack Integration:**  
  Successfully integrated the complete stack of the application, ensuring that all components—including Customer Data, Company/Organization interfaces, and the Authority layer—worked seamlessly together in a local environment.

## What We Learned
During the project, we expanded our knowledge in several key areas:
- **Advanced Encryption Techniques:**  
  Implementing and modifying homomorphic encryption libraries to support split keys.
- **Data Security in B2B SaaS:**  
  Understanding the significance of data security and insurance in B2B solutions, and identifying market opportunities that benefit both businesses and consumers.
- **Web Integration:**  
  Integrating **Web-2** with **Web-3** technologies, including the creation of full-stack visualizations and blockchain integrations, even with limited initial experience.
- **Full-Stack Development:**  
  Building robust front-end applications and learning to balance creativity with technical feasibility.
- **Web-3 Security:**  
  Recognizing the crucial role of Web-3 in enhancing web application security.

## What’s Next for Cipher Shield
We envision Cipher Shield as the standard for mediating demographic and protected data collection across American companies—driving transformative societal outcomes in mitigating discrimination.

### Future Plans:
- **Scalable Data Aggregation:**  
  Extending our capabilities to securely combine datasets from multiple sources (e.g., hospital records).
- **Developer SDK:**  
  Creating an easy-to-use SDK for organizations and industries that are less familiar with blockchain and encryption.
- **Seamless Integration:**  
  Developing a web embedding feature to allow companies to directly integrate a Cipher Shield form or application into their websites.

---
