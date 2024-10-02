<template>
    <v-slide-group direction="vertical" class="PendingMatches">
        <v-slide-group-item v-for="game in pendingGames" :key="game.id">
            <div class="PendingMatches__Item">
                <v-hover v-slot="{ isHovering, props }" open-delay="100">
                    <v-btn
                        rounded
                        v-bind="props"
                        :active="isGameModalActive(game?.id)"
                        @click="openModal(EnumModals.GAME_MODAL, game)"
                    >
                        <v-expand-x-transition>
                            <div
                                v-if="isHovering"
                                class="PendingMatches__Item--extended"
                            >
                                <template
                                    v-for="player in game.players"
                                    :key="player.uid"
                                >
                                    <v-tooltip
                                        :text="player.username"
                                        close-on-content-click
                                        location="top"
                                        scroll-strategy="close"
                                    >
                                        <template #activator="{ props }">
                                            <Avatar
                                                class="PendingMatches__Item__Player"
                                                :size="24"
                                                :src="player.avatar?.icon"
                                                v-bind="props"
                                            />
                                        </template>
                                    </v-tooltip>
                                </template>
                            </div>
                        </v-expand-x-transition>
                        <span class="PendingMatches__Item__Text">
                            {{ getGameDate(game.created_at) }}
                        </span>
                        <template
                            v-for="(badge, index) in getBadges(
                                game.gameSettings,
                            )"
                            :key="`badge-${badge.icon}`"
                        >
                            <v-badge
                                :color="badge.color"
                                :icon="badge.icon"
                                :offset-x="-10"
                                :offset-y="-24 + index * 16"
                            />
                        </template>
                    </v-btn>
                </v-hover>
            </div>
        </v-slide-group-item>
    </v-slide-group>
</template>

<script lang="ts" setup>
    import { Timestamp } from 'firebase/firestore'
    import EnumModals from '~/Enums/EnumModals'
    const { openModal } = useModalManagerStore()
    const { pendingGames } = storeToRefs(useAuthStore())
    const { gameModalSettings } = storeToRefs(useModalManagerStore())

    function getGameDate(JSONtimestamp: Timestamp) {
        const locale = useNuxtApp().$i18n.locale
        const timestamp = new Timestamp(
            JSONtimestamp.seconds,
            JSONtimestamp.nanoseconds,
        )
        const date = timestamp.toDate()
        const formattedDate = new Date(date).toLocaleString(locale, {
            day: 'numeric',
            month: 'short',
        })

        return formattedDate
    }

    function getBadges(gameSettings: GameSettings) {
        const badges = []

        if (gameSettings.isRanked) {
            badges.push({
                icon: 'mdi-medal-outline',
                color: '#f9ad0e',
            })
        }

        if (gameSettings.isMoney) {
            badges.push({
                icon: 'mdi-currency-usd',
                color: '#278664',
            })
        }

        return badges
    }

    function isGameModalActive(gameId: string | undefined) {
        return gameId === gameModalSettings.value?.id
    }
</script>

<style lang="scss">
    $pending-match-button-size: 56px;
    $pending-match-button-padding: 10px;
    $pending-match-button-gap: 5px;
    $max-pending-matches-height: calc(
        (
            (#{$pending-match-button-size} + #{$pending-match-button-gap}) * 4 +
                10px
        )
    );

    .PendingMatches {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        gap: $pending-match-button-gap;
        bottom: calc(var(--v-layout-bottom));
        right: 20px;

        &__Item {
            display: flex;
            justify-content: flex-end;

            &__Text {
                width: calc(
                    #{$pending-match-button-size} - (
                            #{$pending-match-button-padding}
                        ) * 2
                );
                white-space: normal;
                word-break: keep-all;
                font-size: 10px;
            }

            &--extended {
                display: flex;
                flex-wrap: nowrap;
                gap: 5px;
            }

            .v-btn.v-btn--density-default {
                padding: $pending-match-button-padding;
                border-radius: $pending-match-button-size;
                min-height: $pending-match-button-size;
                min-width: $pending-match-button-size;
            }

            .v-badge__badge {
                min-height: unset;
                min-width: unset;
                height: 1rem;
                width: 1rem;
            }
        }
    }

    .v-slide-group {
        &__container {
            max-height: $max-pending-matches-height;
        }
        &__content {
            gap: $pending-match-button-gap;
            padding: 5px 6px 5px 2px;
        }
    }

    .v-slide-group {
        &__next,
        &__prev {
            transform: rotate(90deg);
            width: 64px;
            flex: 0 1;

            &--disabled {
                visibility: hidden;
            }
        }
    }
</style>
