const express = require('express')
const path = require('path')
const fs = require('fs')
const canonicalize = require('canonicalize')
const jose = require('node-jose')

const router = express.Router()

router.post('/', async (req, res) => {
    const certPath = path.join(__dirname, '../config/cert.pem')
    const cert = fs.readFileSync(certPath)

    const der = cert.toString().replace('-----BEGIN CERTIFICATE-----','').replace('-----END CERTIFICATE-----','').replace(/(\r\n|\n|\r)/gm, '')

    const header = {
        alg: 'RS256',
        kty: "RS",
        x5c: [der]
    }
    
    const privateKeyPath = path.join(__dirname, '../config/private-key.pem')
    const privateKey = fs.readFileSync(privateKeyPath)

    const key = await jose.JWK.asKey(privateKey, 'pem')

    const { id, meta, ...rest } = req.body
    
    const payload = canonicalize(rest)

    const signature = await jose.JWS.createSign({ format: 'compact' }, { key, header }).update(payload).final()
    const base64JWS = btoa(signature)

    const sigElement = {
        type: [
          {
            system: "urn:iso-astm:E1762-95:2013",
            code: "1.2.840.10065.1.12.1.5",
            display: "Verification Signature"
          }
        ],
        when: "2021-10-05T22:42:19-07:00",
        who: { 
          reference: "Practitioner/123"    
        },
        onBehalfOf: { 
          reference: "Organization/123"   
        },
        data: base64JWS,
    }

    res.json(sigElement)
})

module.exports = router