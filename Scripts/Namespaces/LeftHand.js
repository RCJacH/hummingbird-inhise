namespace LeftHand {

  inline function setVibratoDepth(float) {

  }

  inline function setVibratoSpeed(float) {

  }

  inline function setPalmMute(boolean) {

  }

  inline function isSilent() {
    return g_lh.isSilent
  }

  inline function setSilent(velocity) {
    if (!velocity) {
      g_lh.isSilent = g_lh.isSilent&2;
    } else {
      g_lh.isSilent = (
        velocity < g_settings.keyswitchThreshold ?
        g_lh.isSilent|1 : g_lh.isSilent^2
      );
    }
  }

  inline function setMuted(velocity) {
    if (!velocity) {
      g_lh.isMuted = g_lh.isMuted&2;
    } else {
      g_lh.isMuted = (
        velocity < g_settings.keyswitchThreshold ?
        g_lh.isMuted|1 : g_lh.isMuted^2
      );
    }
  }

  inline function isOffString() {
    return !g_lh.pressedStringsFlag
  }

  inline function pressedStrings() {
    local strings = [];
    for (i=1; i<7; i++) {
      if (isStringPressed(i)) { strings.push(g_stringsChannel[i]); }
    }
    return strings
  }

  inline function isStringPressed(index) {
    return g_lh.pressedStringsFlag & (1 << (index - 1))
  }

  inline function pressString(string) {
    g_lh.pressedStringsFlag |= string.flag;
    GuitarString.pressFret(string, GuitarString.getFret(string));
  }

  inline function unpressString(string) {
    local isOff = GuitarString.releaseFret(string, GuitarString.getFret(string));
    g_lh.pressedStringsFlag &= (63 - string.flag * isOff);
  }

  inline function changePosition(velocity) {
    local pos = velocity > 120 ? velocity - 108 : Math.floor(velocity / 10);
    g_lh.position = pos;
    local func = (
      g_lh.pressedStrings.isEmpty() ?
      GuitarString.changePosition :
      GuitarString.preparePositionChange
    );
    GuitarString.forAllStrings(
      function (string) {
        return func(string)
      }
    );
  }
}
