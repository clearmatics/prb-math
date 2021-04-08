import { BigNumber } from "@ethersproject/bignumber";
import { expect } from "chai";
import forEach from "mocha-each";

import { MAX_59x18, MAX_WHOLE_59x18, MIN_59x18, MIN_WHOLE_59x18, PI, ZERO } from "../../../../helpers/constants";
import { bn, fp } from "../../../../helpers/numbers";

export default function shouldBehaveLikeFloor(): void {
  context("when x is zero", function () {
    it("returns zero", async function () {
      const x: BigNumber = ZERO;
      const result: BigNumber = await this.contracts.prbMath.doFloor(x);
      expect(result).to.equal(ZERO);
    });
  });

  context("when x is not zero", function () {
    context("when x is negative", function () {
      context("when x < min whole 59.18", function () {
        const testSets = [[MIN_59x18], [MIN_WHOLE_59x18.sub(1)]];

        forEach(testSets).it("takes %e and reverts", async function (x: BigNumber) {
          await expect(this.contracts.prbMath.doFloor(x)).to.be.reverted;
        });
      });

      context("when x >= min whole 59.18", function () {
        const testSets = [
          [MIN_WHOLE_59x18, MIN_WHOLE_59x18],
          [bn(-1e36), bn(-1e36)],
          [fp(-4.2), fp(-5)],
          [fp(-2), fp(-2)],
          [fp(-1.125), fp(-2)],
          [fp(-1), fp(-1)],
          [fp(-0.5), fp(-1)],
          [fp(-0.1), fp(-1)],
        ];

        forEach(testSets).it("takes %e and returns %e", async function (x: BigNumber, expected: BigNumber) {
          const result: BigNumber = await this.contracts.prbMath.doFloor(x);
          expect(expected).to.equal(result);
        });
      });
    });

    context("when x is positive", function () {
      const testSets = [
        [fp(0.1), ZERO],
        [fp(0.5), ZERO],
        [fp(1), fp(1)],
        [fp(1.125), fp(1)],
        [fp(2), fp(2)],
        [PI, fp(3)],
        [fp(4.2), fp(4)],
        [bn(1e36), bn(1e36)],
        [MAX_WHOLE_59x18, MAX_WHOLE_59x18],
        [MAX_59x18, MAX_WHOLE_59x18],
      ];

      forEach(testSets).it("takes %e and returns %e", async function (x: BigNumber, expected: BigNumber) {
        const result: BigNumber = await this.contracts.prbMath.doFloor(x);
        expect(expected).to.equal(result);
      });
    });
  });
}
