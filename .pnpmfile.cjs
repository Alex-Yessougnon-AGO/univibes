// .pnpmfile.cjs
// Removes @prisma/client postinstall to prevent the recursive
// "prisma generate → pnpm add @prisma/client → prisma generate" loop.
// Run "pnpm db:generate" manually after install.
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === '@prisma/client' && pkg.scripts?.postinstall) {
        delete pkg.scripts.postinstall;
      }
      return pkg;
    },
  },
};
