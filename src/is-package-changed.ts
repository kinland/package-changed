import fs from 'fs';
import path from 'path';
import { findPackage } from './find-package';
import { getPackageHash } from './get-package-hash';

const isPackageChanged = ({ hashFilename = '.packagehash' }) => {
    const packagePath = findPackage();
    if (!packagePath) {
        console.error('Cannot find package.json. Travelling up from current working directory.');
        return undefined;
    }

    const packageHashPath = path.join(path.dirname(packagePath), hashFilename);
    const recentDigest = getPackageHash(packagePath);

    const writeHash = (hash: string | undefined) => hash && fs.writeFileSync(packageHashPath, hash);

    // if the hash file doesn't exist
    // or if it does and the hash is different
    let hash: string | undefined = undefined;
    if (
        !fs.existsSync(packageHashPath) ||
        fs.readFileSync(packageHashPath, 'utf-8') !== recentDigest
    ) {
        hash = recentDigest;
    }
    return {
        hash,
        writeHash: writeHash.bind(null, hash),
    };
};

export default isPackageChanged;